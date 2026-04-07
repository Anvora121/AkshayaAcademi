import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { verifyToken } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validation';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Too many authentication attempts, please try again after 15 minutes' },
});

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/logout', logout);
router.get('/me', verifyToken, getMe);

export default router;
