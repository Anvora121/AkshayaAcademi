import express, { Request, Response } from 'express';
import { University } from '../models/University';
import { Course } from '../models/Course';
import { UniversityApplication } from '../models/UniversityApplication';
import { verifyToken, requireRole } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/universities
// @desc    Get universities with filtering and pagination
// @access  Public
router.get('/', async (req: Request, res: Response) => {
    try {
        const { country, search, featured, page, limit } = req.query;
        let query: any = {};

        if (country && country !== 'all') {
            query.country = country;
        }

        if (featured === 'true') {
            query.featured = true;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        // If page/limit provided, return paginated response
        if (page !== undefined || limit !== undefined) {
            const p = Math.max(1, parseInt(page as string) || 1);
            const l = Math.min(50, Math.max(1, parseInt(limit as string) || 12));
            const skip = (p - 1) * l;
            const total = await University.countDocuments(query);
            const universities = await University.find(query)
                .sort({ ranking: 1 })
                .skip(skip)
                .limit(l)
                .select('id name country countryName location ranking rankingSource rankingUpdatedAt logo image featured type description');
            return res.json({
                universities,
                pagination: { total, page: p, pages: Math.ceil(total / l), limit: l }
            });
        }

        // Legacy: return flat array (keeps existing callers working)
        const universities = await University.find(query).sort({ ranking: 1 });
        res.json(universities);
    } catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/universities/:id
// @desc    Get university by slug ID or MongoDB ID
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const idStr = id as string;
        // Try finding by slug ID first, then by MongoDB ID
        let university = await University.findOne({ id: idStr });
        if (!university && idStr.match(/^[0-9a-fA-F]{24}$/)) {
            university = await University.findById(idStr);
        }

        if (!university) {
            return res.status(404).json({ message: 'University not found' });
        }

        // Fetch associated courses
        const courses = await Course.find({ university: university._id });

        res.json({ ...university.toObject(), courses });
    } catch (error) {
        console.error('Error fetching university:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/courses/search
// @desc    Advanced course search with filters
// @access  Public
router.get('/courses/search', async (req: Request, res: Response) => {
    try {
        const { 
            q, 
            country, 
            level, 
            minFee, 
            maxFee, 
            intake,
            page = '1',
            limit = '10'
        } = req.query;

        let courseQuery: any = {};
        let uniQuery: any = {};

        // 1. Course text search
        if (q) {
            courseQuery.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        // 2. Degree Level filter
        if (level && level !== 'all') {
            courseQuery.degreeLevel = level;
        }

        // 3. Tuition Fee filter
        if (minFee || maxFee) {
            courseQuery.tuitionFee = {};
            if (minFee) courseQuery.tuitionFee.$gte = parseInt(minFee as string);
            if (maxFee) courseQuery.tuitionFee.$lte = parseInt(maxFee as string);
        }

        // 4. Intake month filter
        if (intake && intake !== 'all') {
            courseQuery.intakeMonths = intake;
        }

        // 5. Country filter (requires looking up universities)
        if (country && country !== 'all') {
            uniQuery.country = country;
            const unis = await University.find(uniQuery).select('_id');
            const uniIds = unis.map(u => u._id);
            courseQuery.university = { $in: uniIds };
        }

        // Pagination
        const p = parseInt(page as string);
        const l = parseInt(limit as string);
        const skip = (p - 1) * l;

        const total = await Course.countDocuments(courseQuery);
        const courses = await Course.find(courseQuery)
            .populate('university', 'name country logo id location')
            .sort({ name: 1 })
            .skip(skip)
            .limit(l);

        res.json({
            courses,
            pagination: {
                total,
                page: p,
                pages: Math.ceil(total / l),
                limit: l
            }
        });
    } catch (error) {
        console.error('Error searching courses:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/universities/:id/apply
// @desc    Apply to a university (authenticated users)
// @access  Private
router.post('/:id/apply', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        let university = await University.findOne({ id });
        if (!university && (id as string).match(/^[0-9a-fA-F]{24}$/)) {
            university = await University.findById(id);
        }
        if (!university) {
            return res.status(404).json({ message: 'University not found' });
        }

        const existing = await UniversityApplication.findOne({ user: userId, university: university._id });
        if (existing) {
            return res.status(409).json({ message: 'You have already applied to this university', application: existing });
        }

        const application = await UniversityApplication.create({
            user: userId,
            university: university._id,
            status: 'Pending',
        });

        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        console.error('Error applying to university:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/universities/my-applications
// @desc    Get current user's university applications
// @access  Private
router.get('/my-applications', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const applications = await UniversityApplication.find({ user: req.user!.id })
            .populate('university', 'id name location logo image ranking country')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/universities
// @desc    Create/Update university (Admin)
// @access  Admin
router.post('/', verifyToken, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
        const university = await University.findOneAndUpdate(
            { id: req.body.id },
            req.body,
            { upsert: true, new: true, runValidators: true }
        );
        res.json(university);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
