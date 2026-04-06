import express from 'express';
import mongoose from 'mongoose';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import offerRoutes from './routes/offers';
import enquiryRoutes from './routes/enquiries';
import feedbackRoutes from './routes/feedback';
import placementsRoutes from './routes/placements';
import analyticsRoutes from './routes/analytics';

dotenv.config();

// Validate required environment variables at startup
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingEnvVars.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please set these in your .env file before starting the server.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Restrict CORS to the configured frontend origin
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:8081',
    'http://localhost:8080',
    'https://akshayaakademics.com',
    'https://www.akshayaakademics.com',
];

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: Origin ${origin} is not allowed.`));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(express.json());
app.use(cookieParser()); // Parse HttpOnly cookies

// Content rate limiting: max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
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
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/placements', placementsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Database Connection
mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
        });
    })
    .catch((err: Error) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

