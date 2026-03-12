"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const offers_1 = __importDefault(require("./routes/offers"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
dotenv_1.default.config();
// Validate required environment variables at startup
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingEnvVars.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please set these in your .env file before starting the server.');
    process.exit(1);
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Restrict CORS to the configured frontend origin
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:8081',
    'https://akshayaakademics.com',
    'https://www.akshayaakademics.com',
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS policy: Origin ${origin} is not allowed.`));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Middleware
app.use((0, helmet_1.default)()); // Secure HTTP headers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)()); // Parse HttpOnly cookies
// Content rate limiting: max 100 requests per 15 minutes per IP
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
// Apply rate limiter to all /api routes
app.use('/api', apiLimiter);
// Auth routes will have a stricter limiter defined in the auth router
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/offers', offers_1.default);
app.use('/api/enquiries', enquiries_1.default);
// Database Connection
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
    });
})
    .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});
