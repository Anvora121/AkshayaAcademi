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
exports.Education = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TestScoresSchema = new mongoose_1.Schema({
    ielts: { type: Number, min: 0, max: 9 },
    toefl: { type: Number, min: 0, max: 120 },
    gre: { type: Number, min: 260, max: 340 },
    gmat: { type: Number, min: 200, max: 800 },
    sat: { type: Number, min: 400, max: 1600 },
    pte: { type: Number, min: 10, max: 90 },
}, { _id: false });
const EducationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    degree: { type: String, trim: true, required: true },
    specialization: { type: String, trim: true },
    college: { type: String, trim: true, required: true },
    cgpa: { type: Number, min: 0, max: 10, required: true },
    backlogs: { type: Number, min: 0, default: 0 },
    testScores: { type: TestScoresSchema, default: () => ({}) },
}, { timestamps: true });
exports.Education = mongoose_1.default.model('Education', EducationSchema);
