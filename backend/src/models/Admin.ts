import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
    name?: string;
    email: string;
    passwordHash: string;
    role: 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
    {
        name: { type: String, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true },
        role: { type: String, default: 'admin', enum: ['admin'] },
    },
    { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
