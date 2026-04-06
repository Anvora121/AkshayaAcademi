"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UniversityFeedback_1 = require("../models/UniversityFeedback");
const PlacementOffer_1 = require("../models/PlacementOffer");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/analytics/global
// @desc    Admin: global platform KPIs and aggregated stats
// @access  Admin only
router.get('/global', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (_req, res) => {
    try {
        const [feedbackTotal, feedbackApproved, placementTotal, ratingAgg, placementsByCountry, ctcByCountry,] = await Promise.all([
            UniversityFeedback_1.UniversityFeedback.countDocuments(),
            UniversityFeedback_1.UniversityFeedback.countDocuments({ moderationStatus: 'approved' }),
            PlacementOffer_1.PlacementOffer.countDocuments(),
            // Average rating across all approved feedback
            UniversityFeedback_1.UniversityFeedback.aggregate([
                { $match: { moderationStatus: 'approved' } },
                { $group: { _id: null, avgRating: { $avg: '$rating' } } },
            ]),
            // Placement count by country
            PlacementOffer_1.PlacementOffer.aggregate([
                { $group: { _id: '$country', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            // Median/avg CTC by country (full-time only)
            PlacementOffer_1.PlacementOffer.aggregate([
                { $match: { offerType: 'full-time' } },
                {
                    $group: {
                        _id: '$country',
                        avgCTC: { $avg: { $avg: ['$ctcMin', '$ctcMax'] } },
                        currency: { $first: '$currency' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { avgCTC: -1 } },
            ]),
        ]);
        res.json({
            feedback: {
                total: feedbackTotal,
                approved: feedbackApproved,
                pending: feedbackTotal - feedbackApproved,
                averageRating: ratingAgg[0]?.avgRating
                    ? Math.round(ratingAgg[0].avgRating * 10) / 10
                    : 0,
            },
            placements: {
                total: placementTotal,
                byCountry: placementsByCountry.map((b) => ({
                    country: b._id,
                    count: b.count,
                })),
                ctcByCountry: ctcByCountry.map((b) => ({
                    country: b._id,
                    avgCTC: Math.round(b.avgCTC),
                    currency: b.currency,
                    count: b.count,
                })),
            },
        });
    }
    catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/analytics/university/:id
// @desc    Per-university placement and feedback stats
// @access  Public
router.get('/university/:id', async (req, res) => {
    try {
        const universityId = req.params.id;
        const [feedback, placements] = await Promise.all([
            UniversityFeedback_1.UniversityFeedback.find({ universityId, moderationStatus: 'approved' }),
            PlacementOffer_1.PlacementOffer.find({ universityId }),
        ]);
        const avgRating = feedback.length > 0
            ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
            : 0;
        const fullTimeOffers = placements.filter((p) => p.offerType === 'full-time');
        const midpoints = fullTimeOffers
            .map((o) => (o.ctcMin + o.ctcMax) / 2)
            .sort((a, b) => a - b);
        const avgCTC = midpoints.length > 0
            ? midpoints.reduce((sum, v) => sum + v, 0) / midpoints.length
            : 0;
        const mid = Math.floor(midpoints.length / 2);
        const medianCTC = midpoints.length === 0
            ? 0
            : midpoints.length % 2 === 0
                ? (midpoints[mid - 1] + midpoints[mid]) / 2
                : midpoints[mid];
        // Group offers by company
        const byCompany = {};
        placements.forEach((p) => {
            byCompany[p.companyName] = (byCompany[p.companyName] || 0) + 1;
        });
        res.json({
            universityId,
            feedback: {
                count: feedback.length,
                averageRating: Math.round(avgRating * 10) / 10,
            },
            placements: {
                total: placements.length,
                fullTime: fullTimeOffers.length,
                intern: placements.filter((p) => p.offerType === 'intern').length,
                avgCTC: Math.round(avgCTC),
                medianCTC: Math.round(medianCTC),
                currency: placements[0]?.currency || 'USD',
                byCompany: Object.entries(byCompany)
                    .map(([company, count]) => ({ company, count }))
                    .sort((a, b) => b.count - a.count),
            },
        });
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.default = router;
