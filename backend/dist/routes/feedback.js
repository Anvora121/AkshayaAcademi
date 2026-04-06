"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UniversityFeedback_1 = require("../models/UniversityFeedback");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/feedback
// @desc    Get approved feedback for a university
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { universityId } = req.query;
        if (!universityId) {
            return res.status(400).json({ message: 'universityId is required' });
        }
        const feedback = await UniversityFeedback_1.UniversityFeedback.find({
            universityId: String(universityId),
            moderationStatus: 'approved',
        }).sort({ createdAt: -1 });
        const avgRating = feedback.length > 0
            ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
            : 0;
        res.json({
            feedback,
            meta: {
                count: feedback.length,
                averageRating: Math.round(avgRating * 10) / 10,
            },
        });
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/feedback/pending
// @desc    Get all pending feedback for moderation
// @access  Admin
router.get('/pending', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (_req, res) => {
    try {
        const feedback = await UniversityFeedback_1.UniversityFeedback.find({ moderationStatus: 'pending' }).sort({ createdAt: -1 });
        res.json(feedback);
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   POST /api/feedback
// @desc    Submit a feedback/review
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { universityId, reviewerName, reviewerType, rating, reviewText, intakeYear } = req.body;
        if (!universityId || !reviewerName || !reviewerType || !rating || !reviewText || !intakeYear) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (![1, 2, 3, 4, 5].includes(Number(rating))) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if (!['student', 'alumni'].includes(reviewerType)) {
            return res.status(400).json({ message: 'reviewerType must be student or alumni' });
        }
        if (String(reviewText).trim().length < 10) {
            return res.status(400).json({ message: 'Review must be at least 10 characters' });
        }
        const feedback = new UniversityFeedback_1.UniversityFeedback({
            universityId,
            reviewerName: String(reviewerName).trim(),
            reviewerType,
            rating: Number(rating),
            reviewText: String(reviewText).trim(),
            intakeYear: Number(intakeYear),
            moderationStatus: 'pending',
        });
        const saved = await feedback.save();
        res.status(201).json({ message: 'Review submitted successfully. It will be visible after moderation.', feedback: saved });
    }
    catch (error) {
        if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   PATCH /api/feedback/:id/moderate
// @desc    Approve or reject a feedback
// @access  Admin
router.patch('/:id/moderate', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be approved or rejected' });
        }
        const feedback = await UniversityFeedback_1.UniversityFeedback.findByIdAndUpdate(req.params.id, { moderationStatus: status }, { new: true, runValidators: true });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   DELETE /api/feedback/:id
// @desc    Delete a feedback entry
// @access  Admin
router.delete('/:id', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const feedback = await UniversityFeedback_1.UniversityFeedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback deleted' });
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.default = router;
