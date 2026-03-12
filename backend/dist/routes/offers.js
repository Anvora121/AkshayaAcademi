"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Offer_1 = require("../models/Offer");
const auth_1 = require("../middleware/auth");
const Application_1 = require("../models/Application");
const email_1 = require("../utils/email");
const router = express_1.default.Router();
// Auto-deactivate middleware/helper for queries
const deactivateExpiredOffers = async () => {
    const currentDate = new Date();
    await Offer_1.Offer.updateMany({ offerEndDate: { $lt: currentDate }, isActive: true }, { $set: { isActive: false } });
};
// @route   GET /api/offers
// @desc    Get all offers (public, but active only unless admin) with pagination
// @access  Public / Admin
router.get('/', async (req, res) => {
    try {
        await deactivateExpiredOffers();
        const currentDate = new Date();
        // Pagination parameters
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '12', 10);
        const skip = (page - 1) * limit;
        // Count total offers
        const total = await Offer_1.Offer.countDocuments();
        // Normal users see active offers + expired offers (frontend will grey them out)
        const offers = await Offer_1.Offer.find()
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/offers/:id
// @desc    Get offer by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const offer = await Offer_1.Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json(offer);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   POST /api/offers
// @desc    Create a new offer
// @access  Admin
router.post('/', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        // Sanitize input to only include expected fields
        const { universityName, country, image, title, description, originalFee, discountedFee, offerEndDate, features, terms, isActive } = req.body;
        const newOffer = new Offer_1.Offer({
            universityName, country, image, title, description,
            originalFee, discountedFee, offerEndDate, features, terms, isActive
        });
        const savedOffer = await newOffer.save();
        res.status(201).json(savedOffer);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   PUT /api/offers/:id
// @desc    Update an offer
// @access  Admin
router.put('/:id', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        // Sanitize input to only include expected fields
        const { universityName, country, image, title, description, originalFee, discountedFee, offerEndDate, features, terms, isActive } = req.body;
        const updatedOffer = await Offer_1.Offer.findByIdAndUpdate(req.params.id, { universityName, country, image, title, description, originalFee, discountedFee, offerEndDate, features, terms, isActive }, { new: true, runValidators: true });
        if (!updatedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json(updatedOffer);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   DELETE /api/offers/:id
// @desc    Delete an offer
// @access  Admin
router.delete('/:id', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const offer = await Offer_1.Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.json({ message: 'Offer removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   POST /api/offers/:id/apply
// @desc    Apply to a premium offer
// @access  Subscribed users only
router.post('/:id/apply', auth_1.verifyToken, auth_1.requireSubscription, async (req, res) => {
    try {
        const offer = await Offer_1.Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        if (!offer.isActive || new Date(offer.offerEndDate) < new Date()) {
            return res.status(400).json({ message: 'Offer is no longer active' });
        }
        // Check for existing application
        const existingApp = await Application_1.Application.findOne({ userId: req.user?.id, offerId: offer._id });
        if (existingApp) {
            return res.status(400).json({ message: 'You have already applied to this offer' });
        }
        // Save application
        const application = new Application_1.Application({
            userId: req.user?.id,
            offerId: offer._id,
        });
        await application.save();
        res.json({ message: `Successfully applied to ${offer.universityName}` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// Middleware to check for Admin role
const isAdmin = (req, res, next) => {
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
router.post('/:id/apply', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const offerId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized access.' });
        }
        const offer = await Offer_1.Offer.findById(offerId);
        if (!offer || !offer.isActive || new Date(offer.offerEndDate) < new Date()) {
            return res.status(404).json({ message: 'Offer is inactive, expired, or not found.' });
        }
        const existingApplication = await Application_1.Application.findOne({
            user: userId,
            offer: offerId,
            status: { $in: ['pending', 'approved'] }
        });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this offer.' });
        }
        const application = new Application_1.Application({
            user: userId,
            offer: offerId,
            status: 'pending'
        });
        await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application });
    }
    catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Server error while submitting application' });
    }
});
// @route   GET /api/offers/applications/my
// @desc    Get all applications submitted by the logged-in user
// @access  Private
router.get('/applications/my', auth_1.verifyToken, async (req, res) => {
    try {
        const applications = await Application_1.Application.find({ user: req.user?.id })
            .populate('offer')
            .sort({ appliedAt: -1 });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch your applications' });
    }
});
// @route   GET /api/offers/applications/all
// @desc    Get all applications across the platform
// @access  Private (Admin Only)
router.get('/applications/all', auth_1.verifyToken, isAdmin, async (req, res) => {
    try {
        const applications = await Application_1.Application.find()
            .populate('user', 'name email phone country')
            .populate('offer', 'universityName originalFee discountedFee')
            .sort({ appliedAt: -1 });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch all applications' });
    }
});
// @route   PATCH /api/offers/applications/:id/status
// @desc    Approve or Reject an application
// @access  Private (Admin Only)
router.patch('/applications/:id/status', auth_1.verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }
        const application = await Application_1.Application.findById(req.params.id)
            .populate('user')
            .populate('offer');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        application.status = status;
        await application.save();
        // Send Email Notification
        try {
            const user = application.user;
            const offer = application.offer;
            const templateId = process.env.EMAILJS_TEMPLATE_ID_STATUS; // Make sure to add this to .env
            const publicKey = process.env.EMAILJS_PUBLIC_KEY;
            const privateKey = process.env.EMAILJS_PRIVATE_KEY;
            if (templateId && publicKey && privateKey && user && user.email) {
                await (0, email_1.sendEmail)(templateId, {
                    to_email: user.email,
                    to_name: user.name,
                    university_name: offer.universityName,
                    application_status: status.toUpperCase(),
                    reply_to: 'support@akshayaakademics.com'
                }, publicKey, privateKey);
            }
            else {
                console.log("Email notification skipped: Missing EmailJS env config or user email.");
            }
        }
        catch (emailError) {
            console.error("Failed to send status email:", emailError);
            // Don't fail the request if email fails, just log it
        }
        res.json(application);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update application status' });
    }
});
exports.default = router;
