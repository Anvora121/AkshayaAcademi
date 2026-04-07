"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentProfile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TestScoresSchema = new mongoose_1.Schema({
    ielts: { type: Number, min: 0, max: 9 },
    toefl: { type: Number, min: 0, max: 120 },
    gre: { type: Number, min: 260, max: 340 },
    gmat: { type: Number, min: 200, max: 800 },
    sat: { type: Number, min: 400, max: 1600 },
    pte: { type: Number, min: 10, max: 90 },
}, { _id: false });
const StudentProfileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    // Personal details
    phone: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', ''] },
    nationality: { type: String, trim: true },
    // Study preferences
    domain: { type: String, trim: true },
    preferredCountries: [{ type: String, trim: true }],
    preferredUniversities: [{ type: String, trim: true }],
    // Academic
    ugDegree: { type: String, trim: true },
    specialization: { type: String, trim: true },
    college: { type: String, trim: true },
    cgpa: { type: Number, min: 0, max: 10 },
    backlogs: { type: Number, min: 0, default: 0 },
    testScores: { type: TestScoresSchema, default: () => ({}) },
    // Documents
    resumeURL: { type: String },
    transcriptURL: { type: String },
    sopURL: { type: String },
    // Onboarding progress
    onboardingStep: { type: Number, default: 1, min: 1, max: 5 },
    onboardingComplete: { type: Boolean, default: false },
}, { timestamps: true });
exports.StudentProfile = mongoose_1.default.model('StudentProfile', StudentProfileSchema);
