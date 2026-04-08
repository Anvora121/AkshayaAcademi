import express from 'express';
import { updateOnboarding, getFullProfile, updateProfile } from '../controllers/userController';
import { verifyToken } from '../middleware/auth';
import { onboardingValidation } from '../middleware/validation';

const router = express.Router();

// Fetch current user's full profile (personal + preferences + education + documents)
router.get('/profile', verifyToken, getFullProfile);

// Update onboarding progress for a specific step (multi-step registration)
router.put('/profile/step', verifyToken, onboardingValidation, updateOnboarding);

// Update profile — general flat update (used by Edit Profile modal)
router.put('/profile', verifyToken, updateProfile);

export default router;
