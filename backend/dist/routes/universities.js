"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const University_1 = require("../models/University");
const Course_1 = require("../models/Course");
const UniversityApplication_1 = require("../models/UniversityApplication");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/universities
// @desc    Get universities with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { country, search, featured, page, limit } = req.query;
        let query = {};
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
            const p = Math.max(1, parseInt(page) || 1);
            const l = Math.min(50, Math.max(1, parseInt(limit) || 12));
            const skip = (p - 1) * l;
            const total = await University_1.University.countDocuments(query);
            const universities = await University_1.University.find(query)
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
        const universities = await University_1.University.find(query).sort({ ranking: 1 });
        res.json(universities);
    }
    catch (error) {
        console.error('Error fetching universities:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/universities/:id
// @desc    Get university by slug ID or MongoDB ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const idStr = id;
        // Try finding by slug ID first, then by MongoDB ID
        let university = await University_1.University.findOne({ id: idStr });
        if (!university && idStr.match(/^[0-9a-fA-F]{24}$/)) {
            university = await University_1.University.findById(idStr);
        }
        if (!university) {
            return res.status(404).json({ message: 'University not found' });
        }
        // Fetch associated courses
        const courses = await Course_1.Course.find({ university: university._id });
        res.json({ ...university.toObject(), courses });
    }
    catch (error) {
        console.error('Error fetching university:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/courses/search
// @desc    Advanced course search with filters
// @access  Public
router.get('/courses/search', async (req, res) => {
    try {
        const { q, country, level, minFee, maxFee, intake, page = '1', limit = '10' } = req.query;
        let courseQuery = {};
        let uniQuery = {};
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
            if (minFee)
                courseQuery.tuitionFee.$gte = parseInt(minFee);
            if (maxFee)
                courseQuery.tuitionFee.$lte = parseInt(maxFee);
        }
        // 4. Intake month filter
        if (intake && intake !== 'all') {
            courseQuery.intakeMonths = intake;
        }
        // 5. Country filter (requires looking up universities)
        if (country && country !== 'all') {
            uniQuery.country = country;
            const unis = await University_1.University.find(uniQuery).select('_id');
            const uniIds = unis.map(u => u._id);
            courseQuery.university = { $in: uniIds };
        }
        // Pagination
        const p = parseInt(page);
        const l = parseInt(limit);
        const skip = (p - 1) * l;
        const total = await Course_1.Course.countDocuments(courseQuery);
        const courses = await Course_1.Course.find(courseQuery)
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
    }
    catch (error) {
        console.error('Error searching courses:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   POST /api/universities/:id/apply
// @desc    Apply to a university (authenticated users)
// @access  Private
router.post('/:id/apply', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { course } = req.body;
        if (!course) {
            return res.status(400).json({ message: 'Course selection is required to apply' });
        }
        let university = await University_1.University.findOne({ id });
        if (!university && id.match(/^[0-9a-fA-F]{24}$/)) {
            university = await University_1.University.findById(id);
        }
        if (!university) {
            return res.status(404).json({ message: 'University not found' });
        }
        const existing = await UniversityApplication_1.UniversityApplication.findOne({ user: userId, university: university._id });
        if (existing) {
            return res.status(409).json({ message: 'You have already applied to this university', application: existing });
        }
        const application = await UniversityApplication_1.UniversityApplication.create({
            user: userId,
            university: university._id,
            course,
            status: 'Pending',
        });
        res.status(201).json({ message: 'Application submitted successfully', application });
    }
    catch (error) {
        console.error('Error applying to university:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/universities/my-applications
// @desc    Get current user's university applications
// @access  Private
router.get('/my-applications', auth_1.verifyToken, async (req, res) => {
    try {
        const applications = await UniversityApplication_1.UniversityApplication.find({ user: req.user.id })
            .populate('university', 'id name location logo image ranking country')
            .sort({ appliedAt: -1 });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   POST /api/universities
// @desc    Create/Update university (Admin)
// @access  Admin
router.post('/', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const university = await University_1.University.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, returnDocument: 'after', runValidators: true });
        res.json(university);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.default = router;
