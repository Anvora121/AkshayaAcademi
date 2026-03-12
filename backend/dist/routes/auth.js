"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const email_1 = require("../utils/email");
const router = express_1.default.Router();
// Rate limiting for auth routes
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts, please try again after 15 minutes' }
});
const generateToken = (userId, role, subscriptionStatus, name) => {
    return jsonwebtoken_1.default.sign({ id: userId, role, subscriptionStatus, name }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
// Register
router.post('/register', authLimiter, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User_1.User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        let finalRole = role || 'user';
        // Check admin emails from env
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
        if (adminEmails.includes(email.toLowerCase())) {
            finalRole = 'admin';
        }
        user = new User_1.User({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Login
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Logout (Clear Cookie)
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    }).json({ message: 'Logged out successfully' });
});
// Get current user details
router.get('/me', auth_1.verifyToken, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Forgot Password - Generate OTP
router.post('/forgot-password', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Store hash of OTP
        const salt = await bcryptjs_1.default.genSalt(10);
        user.resetPasswordToken = await bcryptjs_1.default.hash(otp, salt);
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        // Send via EmailJS on the backend
        const templateId = process.env.EMAILJS_TEMPLATE_ID_OTP;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;
        const privateKey = process.env.EMAILJS_PRIVATE_KEY;
        if (templateId && publicKey && privateKey) {
            await (0, email_1.sendEmail)(templateId, {
                to_email: email,
                otp: otp,
                reply_to: 'support@akshayaakademics.com',
            }, publicKey, privateKey);
        }
        else {
            console.error("Warning: Missing EMAILJS env vars. OTP generated but email not sent. OTP:", otp);
        }
        res.status(200).json({
            message: 'If an account exists, a reset code has been sent',
            // DO NOT leak the OTP back to the frontend in production
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Reset Password - Verify OTP & Update
router.post('/reset-password', authLimiter, async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User_1.User.findOne({
            email: email.toLowerCase(),
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user || !user.resetPasswordToken) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        const isMatch = await bcryptjs_1.default.compare(otp, user.resetPasswordToken);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        // OTP matched, update password
        const salt = await bcryptjs_1.default.genSalt(10);
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Password has been reset successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
