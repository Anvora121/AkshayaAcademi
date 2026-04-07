import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITestScores {
  ielts?: number;
  toefl?: number;
  gre?: number;
  gmat?: number;
  sat?: number;
  pte?: number;
}

export interface IStudentProfile extends Document {
  userId: Types.ObjectId;
  // Personal
  phone?: string;
  dob?: Date;
  gender?: string;
  nationality?: string;
  // Preferences
  domain?: string;
  preferredCountries: string[];
  preferredUniversities: string[];
  // Academic
  ugDegree?: string;
  specialization?: string;
  college?: string;
  cgpa?: number;
  backlogs?: number;
  testScores: ITestScores;
  // Documents
  resumeURL?: string;
  transcriptURL?: string;
  sopURL?: string;
  // Meta
  onboardingStep: number; // 1-5 — last completed step
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestScoresSchema = new Schema<ITestScores>(
  {
    ielts: { type: Number, min: 0, max: 9 },
    toefl: { type: Number, min: 0, max: 120 },
    gre: { type: Number, min: 260, max: 340 },
    gmat: { type: Number, min: 200, max: 800 },
    sat: { type: Number, min: 400, max: 1600 },
    pte: { type: Number, min: 10, max: 90 },
  },
  { _id: false }
);

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
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
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
