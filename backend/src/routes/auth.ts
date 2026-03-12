import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User, IUser } from '../models/User';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts, please try again after 15 minutes' }
});

const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many password reset attempts, please try again after 15 minutes' }
});

const generateToken = (userId: string, role: string, subscriptionStatus: string, name?: string) => {
    return jwt.sign(
        { id: userId, role, subscriptionStatus, name },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    );
};

// Register
router.post('/register', authLimiter, async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        let finalRole = role || 'user';

        // Check admin emails from env
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
        if (adminEmails.includes(email.toLowerCase())) {
            finalRole = 'admin';
        }

        user = new User({
            name,
            email,
            passwordHash,
            role: finalRole,
            subscriptionStatus: finalRole === 'subscribed' ? 'active' : 'inactive',
            subscriptionExpiry: finalRole === 'subscribed' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined // 30 days default
        });

        await user.save();

        const token = generateToken(user.id, user.role, user.subscriptionStatus, user.name);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        }).status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', authLimiter, async (req: Request, res: Response) => {
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

        const token = generateToken(user.id, user.role, user.subscriptionStatus, user.name);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        }).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout (Clear Cookie)
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    }).json({ message: 'Logged out successfully' });
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

// Forgot Password - Generate OTP
router.post('/forgot-password', authLimiter, async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store hash of OTP
        const salt = await bcrypt.genSalt(10);
        user.resetPasswordToken = await bcrypt.hash(otp, salt);
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Send via EmailJS on the backend
        const templateId = process.env.EMAILJS_TEMPLATE_ID_OTP;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;
        const privateKey = process.env.EMAILJS_PRIVATE_KEY;

        if (templateId && publicKey && privateKey) {
            await sendEmail(templateId, {
                to_email: email,
                otp: otp,
                reply_to: 'support@akshayaakademics.com',
            }, publicKey, privateKey);
        } else {
            console.error("Warning: Missing EMAILJS env vars. OTP generated but email not sent. OTP:", otp);
        }

        res.status(200).json({
            message: 'If an account exists, a reset code has been sent',
            // DO NOT leak the OTP back to the frontend in production
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password - Verify OTP & Update
router.post('/reset-password', resetPasswordLimiter, async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user || !user.resetPasswordToken) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const isMatch = await bcrypt.compare(otp, user.resetPasswordToken);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP matched, update password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
