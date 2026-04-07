import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITestScores {
  ielts?: number;
  toefl?: number;
  gre?: number;
  gmat?: number;
  sat?: number;
  pte?: number;
}

export interface IEducation extends Document {
  userId: Types.ObjectId;
  degree: string;
  specialization: string;
  college: string;
  cgpa: number;
  backlogs: number;
  testScores: ITestScores;
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

const EducationSchema = new Schema<IEducation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    degree: { type: String, trim: true, required: true },
    specialization: { type: String, trim: true },
    college: { type: String, trim: true, required: true },
    cgpa: { type: Number, min: 0, max: 10, required: true },
    backlogs: { type: Number, min: 0, default: 0 },
    testScores: { type: TestScoresSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Education = mongoose.model<IEducation>('Education', EducationSchema);
