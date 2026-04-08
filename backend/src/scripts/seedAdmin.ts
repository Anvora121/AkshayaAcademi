import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load the .env file from the backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { Admin } from '../models/Admin';

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to DB');

        const email = 'admin@akshayaakademics.com';
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (existingAdmin) {
            console.log('Admin already exists. Deleting and recreating...');
            await Admin.deleteOne({ email: email.toLowerCase() });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash('Admin@2024!', salt);

        const newAdmin = new Admin({
            name: 'Akshaya Admin',
            email: email.toLowerCase(),
            passwordHash: passwordHash,
            role: 'admin'
        });

        await newAdmin.save();
        console.log('Admin user seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
