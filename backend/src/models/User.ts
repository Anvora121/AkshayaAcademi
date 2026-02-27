import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'user' | 'subscribed' | 'admin';
export type SubscriptionStatus = 'active' | 'inactive';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    subscriptionExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true },
        role: { type: String, required: true, enum: ['user', 'subscribed', 'admin'], default: 'user' },
        subscriptionStatus: { type: String, required: true, enum: ['active', 'inactive'], default: 'inactive' },
        subscriptionExpiry: { type: Date },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
