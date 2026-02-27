import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: UserRole;
        subscriptionStatus: string;
    };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const requireRole = (roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }

        next();
    };
};

// Middleware to check if user has active subscription
export const requireSubscription = (req: AuthRequest, res: Response, next: NextFunction) => {
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
