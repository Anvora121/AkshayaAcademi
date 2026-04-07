"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardingValidation = exports.loginValidation = exports.registerValidation = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
};
exports.validate = validate;
exports.registerValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required').trim(),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    exports.validate,
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    exports.validate,
];
exports.onboardingValidation = [
    (0, express_validator_1.body)('step').isInt({ min: 1, max: 5 }).withMessage('Invalid onboarding step'),
    (0, express_validator_1.body)('data').isObject().withMessage('Data must be an object'),
    exports.validate,
];
