import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aditiytej');
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('123456', salt);

        // Seed Users
        const users = [
            {
                email: 'admin@test.com',
                passwordHash,
                role: 'admin',
                subscriptionStatus: 'active',
            },
            {
                email: 'sub@test.com',
                passwordHash,
                role: 'subscribed',
                subscriptionStatus: 'active',
                subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            },
            {
                email: 'user@test.com',
                passwordHash,
                role: 'user',
                subscriptionStatus: 'inactive',
            }
        ];

        await User.insertMany(users);
        console.log('Successfully seeded database with demo users:');
        console.log('Admin: admin@test.com / 123456');
        console.log('Subscribed: sub@test.com / 123456');
        console.log('User: user@test.com / 123456');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
