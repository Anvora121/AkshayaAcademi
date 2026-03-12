"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./models/User");
dotenv_1.default.config();
const seedDatabase = async () => {
    if (!process.env.MONGODB_URI) {
        console.error("FATAL ERROR: MONGODB_URI is not defined.");
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        // Clear existing users
        await User_1.User.deleteMany({});
        console.log('Cleared existing users');
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash('123456', salt);
        // Seed Users
        const users = [
            {
                name: 'System Admin',
                email: 'admin@test.com',
                passwordHash,
                role: 'admin',
                subscriptionStatus: 'active',
            },
            {
                name: 'Premium Member',
                email: 'sub@test.com',
                passwordHash,
                role: 'subscribed',
                subscriptionStatus: 'active',
                subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            },
            {
                name: 'Regular User',
                email: 'user@test.com',
                passwordHash,
                role: 'user',
                subscriptionStatus: 'inactive',
            }
        ];
        await User_1.User.insertMany(users);
        console.log('Successfully seeded database with demo users:');
        console.log('Admin: admin@test.com / 123456');
        console.log('Subscribed: sub@test.com / 123456');
        console.log('User: user@test.com / 123456');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDatabase();
