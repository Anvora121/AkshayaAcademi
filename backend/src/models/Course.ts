import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
    university: mongoose.Types.ObjectId;
    name: string;
    duration: string;
    degreeLevel: 'Bachelor\'s' | 'Master\'s' | 'Doctorate' | 'Other';
    tuitionFee: number; // Normalized numeric value for filtering
    tuitionCurrency: string; // e.g. 'USD', 'GBP', 'CAD'
    tuitionOriginal: string; // Original string from data (e.g. '$57,986/year')
    intakeMonths: string[]; // e.g. ['September', 'January']
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
    {
        university: { type: Schema.Types.ObjectId, ref: 'University', required: true, index: true },
        name: { type: String, required: true, trim: true, index: true },
        duration: { type: String },
        degreeLevel: { type: String, enum: ['Bachelor\'s', 'Master\'s', 'Doctorate', 'Other'], required: true, index: true },
        tuitionFee: { type: Number, index: true },
        tuitionCurrency: { type: String },
        tuitionOriginal: { type: String },
        intakeMonths: [{ type: String }],
        description: { type: String },
    },
    { timestamps: true }
);

// Compound search index for faster filtering
CourseSchema.index({ name: 'text', description: 'text' });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
