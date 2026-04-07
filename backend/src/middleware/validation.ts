import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  validate,
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const onboardingValidation = [
  body('step').isInt({ min: 1, max: 5 }).withMessage('Invalid onboarding step'),
  body('data').isObject().withMessage('Data must be an object'),
  validate,
];
