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
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const offers_1 = __importDefault(require("./routes/offers"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const placements_1 = __importDefault(require("./routes/placements"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const universities_1 = __importDefault(require("./routes/universities"));
const onboarding_1 = __importDefault(require("./routes/onboarding"));
const uploads_1 = __importDefault(require("./routes/uploads"));
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
// Render/other proxies set X-Forwarded-* headers; trust first proxy hop.
app.set('trust proxy', 1);
// Restrict CORS to configured frontend origin(s)
const envAllowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedOrigins = [
    ...envAllowedOrigins,
    'http://localhost:8081',
    'http://localhost:8080',
    'https://akshayaakademics.com',
    'https://www.akshayaakademics.com',
    'https://akshaya-academi.vercel.app',
];
const allowedOriginPatterns = [
    /^https:\/\/akshaya-academi(?:-[a-z0-9-]+)?\.vercel\.app$/i,
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        const isPatternAllowed = !!origin && allowedOriginPatterns.some((pattern) => pattern.test(origin));
        if (!origin || allowedOrigins.includes(origin) || isPatternAllowed) {
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
// Serve uploaded files as static assets
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/offers', offers_1.default);
app.use('/api/enquiries', enquiries_1.default);
app.use('/api/feedback', feedback_1.default);
app.use('/api/placements', placements_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/universities', universities_1.default);
app.use('/api/onboarding', onboarding_1.default);
app.use('/api/uploads', uploads_1.default);
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
