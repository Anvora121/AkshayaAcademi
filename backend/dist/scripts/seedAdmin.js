"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const Admin_1 = require("../models/Admin");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const seedAdmin = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        const email = process.env.ADMIN_EMAIL || 'admin@akshayaakademics.com';
        const password = process.env.ADMIN_PASSWORD || 'Admin@123';
        const existingAdmin = await Admin_1.Admin.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const admin = new Admin_1.Admin({
            name: 'Super Admin',
            email,
            passwordHash,
            role: 'admin',
        });
        await admin.save();
        console.log('Admin user created successfully');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};
seedAdmin();
