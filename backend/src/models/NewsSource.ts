import mongoose, { Document, Schema } from 'mongoose';

export interface INewsSource extends Document {
    universityName: string;
    rssUrl: string;
    country: string;
    logoUrl?: string;
    active: boolean;
    lastFetched?: Date;
    totalFetched: number;
    lastError?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NewsSourceSchema = new Schema<INewsSource>(
    {
        universityName: { type: String, required: true, trim: true },
        rssUrl: { type: String, required: true, unique: true, trim: true },
        country: { type: String, trim: true, default: '' },
        logoUrl: { type: String },
        active: { type: Boolean, default: true },
        lastFetched: { type: Date },
        totalFetched: { type: Number, default: 0 },
        lastError: { type: String },
    },
    { timestamps: true }
);

export const NewsSource = mongoose.model<INewsSource>('NewsSource', NewsSourceSchema);
