import express from 'express';
import mongoose from 'mongoose';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import offerRoutes from './routes/offers';

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

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);

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

