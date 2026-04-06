"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PlacementOffer_1 = require("../models/PlacementOffer");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/placements
// @desc    Get placement offers with optional filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { universityId, country, company, ctcMin, ctcMax, offerType, batchYear } = req.query;
        const filter = {};
        if (universityId)
            filter.universityId = String(universityId);
        if (country)
            filter.country = String(country);
        if (company && company !== 'all')
            filter.companyName = String(company);
        if (offerType)
            filter.offerType = String(offerType);
        if (batchYear)
            filter.batchYear = Number(batchYear);
        if (ctcMin || ctcMax) {
            filter.ctcMax = ctcMin ? { $gte: Number(ctcMin) } : undefined;
            filter.ctcMin = ctcMax ? { $lte: Number(ctcMax) } : undefined;
            // Clean undefined values
            Object.keys(filter).forEach((k) => filter[k] === undefined && delete filter[k]);
        }
        const offers = await PlacementOffer_1.PlacementOffer.find(filter).sort({ batchYear: -1, ctcMax: -1 });
        res.json(offers);
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/placements/stats/:universityId
// @desc    Get CTC stats for a university
// @access  Public
router.get('/stats/:universityId', async (req, res) => {
    try {
        const offers = await PlacementOffer_1.PlacementOffer.find({
            universityId: req.params.universityId,
            offerType: 'full-time',
        });
        if (offers.length === 0) {
            return res.json({ median: 0, average: 0, currency: 'USD', count: 0 });
        }
        const midpoints = offers
            .map((o) => (o.ctcMin + o.ctcMax) / 2)
            .sort((a, b) => a - b);
        const avg = midpoints.reduce((sum, v) => sum + v, 0) / midpoints.length;
        const mid = Math.floor(midpoints.length / 2);
        const median = midpoints.length % 2 === 0
            ? (midpoints[mid - 1] + midpoints[mid]) / 2
            : midpoints[mid];
        res.json({
            median: Math.round(median),
            average: Math.round(avg),
            currency: offers[0].currency,
            count: offers.length,
        });
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   POST /api/placements
// @desc    Create a placement offer
// @access  Admin
router.post('/', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const { universityId, universityName, country, companyName, role, offerType, ctcMin, ctcMax, currency, location, batchYear } = req.body;
        const offer = new PlacementOffer_1.PlacementOffer({
            universityId, universityName, country, companyName, role, offerType,
            ctcMin: Number(ctcMin), ctcMax: Number(ctcMax), currency, location,
            batchYear: Number(batchYear),
        });
        const saved = await offer.save();
        res.status(201).json(saved);
    }
    catch (error) {
        if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   DELETE /api/placements/:id
// @desc    Delete a placement offer
// @access  Admin
router.delete('/:id', auth_1.verifyToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const offer = await PlacementOffer_1.PlacementOffer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Placement offer not found' });
        }
        res.json({ message: 'Placement offer deleted' });
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.default = router;
