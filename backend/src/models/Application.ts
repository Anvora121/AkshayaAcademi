import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
    user: mongoose.Types.ObjectId;
    offer: mongoose.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    appliedAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offer: {
        type: Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: { createdAt: 'appliedAt', updatedAt: 'updatedAt' }
});

// Ensure a user can only apply to a specific offer once
ApplicationSchema.index({ user: 1, offer: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
