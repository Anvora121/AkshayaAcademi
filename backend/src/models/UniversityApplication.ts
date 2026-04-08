import mongoose, { Document, Schema } from 'mongoose';

export interface IUniversityApplication extends Document {
    user: mongoose.Types.ObjectId;
    university: mongoose.Types.ObjectId;
    country: mongoose.Types.ObjectId;
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedAt: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UniversityApplicationSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        university: { type: Schema.Types.ObjectId, ref: 'University', required: true, index: true },
        country: { type: Schema.Types.ObjectId, ref: 'Country', index: true },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        appliedAt: { type: Date, default: Date.now },
        notes: { type: String }
    },
    { timestamps: true }
);

// A user should only apply to the same university once.
UniversityApplicationSchema.index({ user: 1, university: 1 }, { unique: true });

export const UniversityApplication = mongoose.model<IUniversityApplication>('UniversityApplication', UniversityApplicationSchema);
