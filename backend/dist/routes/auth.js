"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = express_1.default.Router();
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { message: 'Too many authentication attempts, please try again after 15 minutes' },
});
router.post('/register', authLimiter, validation_1.registerValidation, authController_1.register);
router.post('/login', authLimiter, validation_1.loginValidation, authController_1.login);
router.post('/logout', authController_1.logout);
router.get('/me', auth_1.verifyToken, authController_1.getMe);
exports.default = router;
