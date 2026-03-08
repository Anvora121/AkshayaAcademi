import express, { Request, Response, NextFunction } from 'express';
import { Offer } from '../models/Offer';
import { verifyToken, requireRole, requireSubscription, AuthRequest } from '../middleware/auth';
import { Application } from '../models/Application';
import { sendEmail } from '../utils/email';

const router = express.Router();

// Auto-deactivate middleware/helper for queries
const deactivateExpiredOffers = async () => {
    const currentDate = new Date();
    await Offer.updateMany(
        { offerEndDate: { $lt: currentDate }, isActive: true },
        { $set: { isActive: false } }
    );
};

// @route   GET /api/offers
// @desc    Get all offers (public, but active only unless admin) with pagination
// @access  Public / Admin
router.get('/', async (req: Request, res: Response) => {
    try {
        await deactivateExpiredOffers();
        const currentDate = new Date();

        // Pagination parameters
        const page = parseInt((req.query.page as string) || '1', 10);
        const limit = parseInt((req.query.limit as string) || '12', 10);
        const skip = (page - 1) * limit;

        // Count total offers
        const total = await Offer.countDocuments();

        // Normal users see active offers + expired offers (frontend will grey them out)
        const offers = await Offer.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            offers,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/offers/:id
// @desc    Get offer by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json(offer);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/offers
// @desc    Create a new offer
// @access  Admin
router.post('/', verifyToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
    try {
        // Sanitize input to only include expected fields
        const { universityName, country, image, title, description, originalFee, discountedFee, offerEndDate, features, terms, isActive } = req.body;

        const newOffer = new Offer({
            universityName, country, image, title, description,
            originalFee, discountedFee, offerEndDate, features, terms, isActive
        });

        const savedOffer = await newOffer.save();
        res.status(201).json(savedOffer);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/offers/:id
// @desc    Update an offer
// @access  Admin
router.put('/:id', verifyToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
    try {
        // Sanitize input to only include expected fields
        const { universityName, country, image, title, description, originalFee, discountedFee, offerEndDate, features, terms, isActive } = req.body;

        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            { universityName, country, image, title, description, originalFee, discountedFee, offerEndDate, features, terms, isActive },
            { new: true, runValidators: true }
        );

        if (!updatedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json(updatedOffer);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/offers/:id
// @desc    Delete an offer
// @access  Admin
router.delete('/:id', verifyToken, requireRole(['admin']), async (req: AuthRequest, res: Response) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json({ message: 'Offer removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/offers/:id/apply
// @desc    Apply to a premium offer
// @access  Subscribed users only
router.post('/:id/apply', verifyToken, requireSubscription, async (req: AuthRequest, res: Response) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        if (!offer.isActive || new Date(offer.offerEndDate) < new Date()) {
            return res.status(400).json({ message: 'Offer is no longer active' });
        }

        // Check for existing application
        const existingApp = await Application.findOne({ userId: req.user?.id, offerId: offer._id });
        if (existingApp) {
            return res.status(400).json({ message: 'You have already applied to this offer' });
        }

        // Save application
        const application = new Application({
            userId: req.user?.id,
            offerId: offer._id,
        });
        await application.save();

        res.json({ message: `Successfully applied to ${offer.universityName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Middleware to check for Admin role
const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Access denied. Admin only.' });
        return;
    }
    next();
};

// ==========================================
// APPLICATION ROUTES
// ==========================================

// @route   POST /api/offers/:id/apply
// @desc    Create an application for an offer
router.post('/:id/apply', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const offerId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized access.' });
        }

        const offer = await Offer.findById(offerId);
        if (!offer || !offer.isActive || new Date(offer.offerEndDate) < new Date()) {
            return res.status(404).json({ message: 'Offer is inactive, expired, or not found.' });
        }

        const existingApplication = await Application.findOne({
            user: userId,
            offer: offerId,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this offer.' });
        }

        const application = new Application({
            user: userId,
            offer: offerId,
            status: 'pending'
        });

        await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application });

    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Server error while submitting application' });
    }
});

// @route   GET /api/offers/applications/my
// @desc    Get all applications submitted by the logged-in user
// @access  Private
router.get('/applications/my', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const applications = await Application.find({ user: req.user?.id })
            .populate('offer')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your applications' });
    }
});

// @route   GET /api/offers/applications/all
// @desc    Get all applications across the platform
// @access  Private (Admin Only)
router.get('/applications/all', verifyToken, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const applications = await Application.find()
            .populate('user', 'name email phone country')
            .populate('offer', 'universityName originalFee discountedFee')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all applications' });
    }
});

// @route   PATCH /api/offers/applications/:id/status
// @desc    Approve or Reject an application
// @access  Private (Admin Only)
router.patch('/applications/:id/status', verifyToken, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        const application = await Application.findById(req.params.id)
            .populate('user')
            .populate('offer');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status as 'pending' | 'approved' | 'rejected';
        await application.save();

        // Send Email Notification
        try {
            const user = application.user as any;
            const offer = application.offer as any;
            const templateId = process.env.EMAILJS_TEMPLATE_ID_STATUS; // Make sure to add this to .env
            const publicKey = process.env.EMAILJS_PUBLIC_KEY;
            const privateKey = process.env.EMAILJS_PRIVATE_KEY;

            if (templateId && publicKey && privateKey && user && user.email) {
                await sendEmail(templateId, {
                    to_email: user.email,
                    to_name: user.name,
                    university_name: offer.universityName,
                    application_status: status.toUpperCase(),
                    reply_to: 'support@akshayaakademics.com'
                }, publicKey, privateKey);
            } else {
                console.log("Email notification skipped: Missing EmailJS env config or user email.");
            }
        } catch (emailError) {
            console.error("Failed to send status email:", emailError);
            // Don't fail the request if email fails, just log it
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update application status' });
    }
});

export default router;
