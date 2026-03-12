"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSubscription = exports.requireRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
        process.exit(1);
    }
    return secret;
};
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.verifyToken = verifyToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};
exports.requireRole = requireRole;
// Middleware to check if user has active subscription
const requireSubscription = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    // Admin bypasses subscription check
    if (req.user.role === 'admin') {
        return next();
    }
    if (req.user.role !== 'subscribed' || req.user.subscriptionStatus !== 'active') {
        return res.status(403).json({ message: 'Access denied: Active subscription required' });
    }
    next();
};
exports.requireSubscription = requireSubscription;
