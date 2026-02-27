import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
    universityName: string;
    description: string;
    originalFee: number;
    discountedFee: number;
    offerStartDate: Date;
    offerEndDate: Date;
    isActive: boolean;
    premiumOnlyAction: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const OfferSchema: Schema = new Schema(
    {
        universityName: { type: String, required: true },
        description: { type: String, required: true },
        originalFee: { type: Number, required: true },
        discountedFee: { type: Number, required: true },
        offerStartDate: { type: Date, required: true },
        offerEndDate: { type: Date, required: true },
        isActive: { type: Boolean, required: true, default: true },
        premiumOnlyAction: { type: Boolean, required: true, default: true },
    },
    { timestamps: true }
);

export const Offer = mongoose.model<IOffer>('Offer', OfferSchema);
