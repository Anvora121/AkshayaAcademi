import mongoose, { Document, Schema } from 'mongoose';

export interface IPlacementOffer extends Document {
    universityId: string;
    universityName: string;
    country: string;
    companyName: string;
    role: string;
    offerType: 'intern' | 'full-time';
    ctcMin: number;
    ctcMax: number;
    currency: string;
    location: string;
    batchYear: number;
    createdAt: Date;
    updatedAt: Date;
}

const PlacementOfferSchema = new Schema<IPlacementOffer>(
    {
        universityId: { type: String, required: true },
        universityName: { type: String, required: true },
        country: { type: String, required: true },
        companyName: { type: String, required: true },
        role: { type: String, required: true },
        offerType: {
            type: String,
            enum: ['intern', 'full-time'],
            required: true,
        },
        ctcMin: { type: Number, required: true, min: 0 },
        ctcMax: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true, default: 'USD' },
        location: { type: String, required: true },
        batchYear: { type: Number, required: true, min: 2000, max: 2100 },
    },
    { timestamps: true }
);

// Indexes for filtering and aggregation
PlacementOfferSchema.index({ universityId: 1 });
PlacementOfferSchema.index({ country: 1 });
PlacementOfferSchema.index({ companyName: 1 });
PlacementOfferSchema.index({ batchYear: -1 });

export const PlacementOffer = mongoose.model<IPlacementOffer>(
    'PlacementOffer',
    PlacementOfferSchema
);
