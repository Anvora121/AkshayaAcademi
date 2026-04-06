import mongoose, { Document, Schema } from 'mongoose';

export interface IUniversityFeedback extends Document {
    universityId: string;
    reviewerName: string;
    reviewerType: 'student' | 'alumni';
    rating: 1 | 2 | 3 | 4 | 5;
    reviewText: string;
    intakeYear: number;
    moderationStatus: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const UniversityFeedbackSchema = new Schema<IUniversityFeedback>(
    {
        universityId: { type: String, required: true },
        reviewerName: { type: String, required: true, maxlength: 100 },
        reviewerType: {
            type: String,
            enum: ['student', 'alumni'],
            required: true,
        },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: true,
        },
        reviewText: { type: String, required: true, minlength: 10, maxlength: 1000 },
        intakeYear: { type: Number, required: true, min: 1990, max: 2030 },
        moderationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// Indexes for common query patterns
UniversityFeedbackSchema.index({ universityId: 1, moderationStatus: 1 });
UniversityFeedbackSchema.index({ createdAt: -1 });

export const UniversityFeedback = mongoose.model<IUniversityFeedback>(
    'UniversityFeedback',
    UniversityFeedbackSchema
);
