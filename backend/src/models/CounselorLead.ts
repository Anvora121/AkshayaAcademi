import mongoose, { Document, Schema } from 'mongoose';

export interface ICounselorLead extends Document {
    name: string;
    email: string;
    phone: string;
    universityName?: string;
    message?: string;
    status: 'new' | 'contacted' | 'resolved';
    createdAt: Date;
    updatedAt: Date;
}

const CounselorLeadSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        universityName: { type: String, trim: true },
        message: { type: String, trim: true },
        status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' },
    },
    { timestamps: true }
);

export const CounselorLead = mongoose.model<ICounselorLead>('CounselorLead', CounselorLeadSchema);
