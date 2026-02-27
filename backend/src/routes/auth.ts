import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

const generateToken = (userId: string, role: string, subscriptionStatus: string) => {
    return jwt.sign(
        { id: userId, role, subscriptionStatus },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1d' }
    );
};

// Register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        let finalRole = role || 'user';
        if (email.toLowerCase().includes('admin@akshayaakademics.com') || email.toLowerCase().includes('admin@adityatej.com') || email.toLowerCase() === 'admin@test.com') {
            finalRole = 'admin';
        }

        user = new User({
            email,
            passwordHash,
            role: finalRole,
            subscriptionStatus: finalRole === 'subscribed' ? 'active' : 'inactive',
            subscriptionExpiry: finalRole === 'subscribed' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined // 30 days default
        });

        await user.save();

        const token = generateToken(user.id, user.role, user.subscriptionStatus);
        res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.role, user.subscriptionStatus);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user details
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
