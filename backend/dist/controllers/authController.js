"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Admin_1 = require("../models/Admin");
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};
const getAuthCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        // Cross-site cookies (Vercel frontend -> Render backend) require SameSite=None.
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    };
};
const register = async (req, res) => {
    try {
        const { name, email, password, phone, dob, gender, nationality } = req.body;
        const existingUser = await User_1.User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = new User_1.User({
            name,
            email: email.toLowerCase(),
            passwordHash,
            phone,
            dob: dob ? new Date(dob) : undefined,
            gender,
            nationality,
            role: 'user',
            onboardingStep: 1,
        });
        await user.save();
        const token = generateToken(user.id, user.role);
        res.cookie('token', token, getAuthCookieOptions());
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                onboardingComplete: user.onboardingComplete,
                onboardingStep: user.onboardingStep,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();
        // 1. Check Admin first
        const admin = await Admin_1.Admin.findOne({ email: normalizedEmail });
        if (admin) {
            const isMatch = await bcryptjs_1.default.compare(password, admin.passwordHash);
            if (isMatch) {
                const token = generateToken(admin.id, 'admin');
                res.cookie('token', token, getAuthCookieOptions());
                return res.json({
                    user: {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                        role: 'admin',
                        onboardingComplete: true,
                    },
                });
            }
        }
        // 2. Check User
        const user = await User_1.User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user.id, user.role);
        res.cookie('token', token, getAuthCookieOptions());
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                onboardingComplete: user.onboardingComplete,
                onboardingStep: user.onboardingStep,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.login = login;
const logout = (req, res) => {
    // Clear with the same attributes used when setting the cookie.
    res.clearCookie('token', getAuthCookieOptions());
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        // Check Admin
        const admin = await Admin_1.Admin.findById(req.user.id).select('-passwordHash');
        if (admin) {
            return res.json({ ...admin.toObject(), id: admin.id });
        }
        // Check User
        const user = await User_1.User.findById(req.user.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ ...user.toObject(), id: user.id });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMe = getMe;
