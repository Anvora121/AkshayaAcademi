"use strict";
/**
 * createAdmin.ts
 * ──────────────────────────────────────────────────────────────────────────
 * One-time script to create (or update) an admin account in MongoDB.
 * Run with:  npx ts-node src/scripts/createAdmin.ts
 *
 * Usage:
 *   ADMIN_EMAIL=admin@akshayaakademics.com \
 *   ADMIN_PASSWORD=StrongP@ssw0rd           \
 *   ADMIN_NAME="Akshaya Admin"               \
 *   npx ts-node src/scripts/createAdmin.ts
 *
 * Or fill in the DEFAULT_* constants below for quick local setup.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Load .env from the backend root
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// ── Inline schema (avoid circular imports) ───────────────────────────────────
const AdminSchema = new mongoose_1.default.Schema({
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin'] },
}, { timestamps: true });
const Admin = mongoose_1.default.model('Admin', AdminSchema);
// ── Config — override via env vars or edit defaults here ─────────────────────
const DEFAULT_EMAIL = 'admin@akshayaakademics.com';
const DEFAULT_PASSWORD = 'Admin@2024!';
const DEFAULT_NAME = 'Akshaya Admin';
const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
const adminName = process.env.ADMIN_NAME || DEFAULT_NAME;
async function main() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('❌  MONGODB_URI is not set in .env. Aborting.');
        process.exit(1);
    }
    console.log('⏳  Connecting to MongoDB…');
    await mongoose_1.default.connect(mongoUri);
    console.log('✅  Connected to MongoDB.');
    // Hash the password
    const salt = await bcryptjs_1.default.genSalt(12);
    const passwordHash = await bcryptjs_1.default.hash(adminPassword, salt);
    const existing = await Admin.findOne({ email: adminEmail.toLowerCase() });
    if (existing) {
        // Update password & name in case they changed
        existing.set({ name: adminName, passwordHash });
        await existing.save();
        console.log(`🔄  Admin already existed — credentials updated for: ${adminEmail}`);
    }
    else {
        await Admin.create({
            name: adminName,
            email: adminEmail.toLowerCase(),
            passwordHash,
            role: 'admin',
        });
        console.log(`🎉  Admin created successfully!`);
    }
    console.log('');
    console.log('   Email   :', adminEmail);
    console.log('   Password:', adminPassword, '  ← Change this in production!');
    console.log('');
    await mongoose_1.default.disconnect();
    console.log('🔌  Disconnected. Done.');
}
main().catch((err) => {
    console.error('Script failed:', err);
    process.exit(1);
});
