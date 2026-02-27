import express, { Request, Response } from 'express';
import { Offer } from '../models/Offer';
import { verifyToken, requireRole, requireSubscription, AuthRequest } from '../middleware/auth';

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
// @desc    Get all offers (public, but active only unless admin)
// @access  Public / Admin
router.get('/', async (req: Request, res: Response) => {
    try {
        await deactivateExpiredOffers();
        const currentDate = new Date();

        // Normal users see active offers + expired offers (frontend will grey them out)
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json(offers);
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
        const newOffer = new Offer(req.body);
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
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

        // Process the application logic here (e.g., save to user's applications)
        // For now, return success
        res.json({ message: `Successfully applied to ${offer.universityName}` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
