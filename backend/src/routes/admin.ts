import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController';
import { verifyToken, requireRole } from '../middleware/auth';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(verifyToken, requireRole(['admin']));

// GET /api/admin/users — list all non-admin users with joined preferences & education
router.get('/users', getAllUsers);

// GET /api/admin/users/:id — full profile of a single user
router.get('/users/:id', getUserById);

export default router;
