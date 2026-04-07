import express from 'express';
import { updateOnboarding, getFullProfile } from '../controllers/userController';
import { verifyToken } from '../middleware/auth';
import { onboardingValidation } from '../middleware/validation';

const router = express.Router();

// Fetch current user's full profile (including preferences, education, documents)
router.get('/profile', verifyToken, getFullProfile);

// Update onboarding progress for a specific step
router.put('/profile', verifyToken, onboardingValidation, updateOnboarding);

export default router;
