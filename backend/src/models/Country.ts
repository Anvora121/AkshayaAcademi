import mongoose, { Document, Schema } from 'mongoose';

export interface ICountry extends Document {
    name: string;
    code: string;
    active: boolean;
    flagUrl?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CountrySchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        code: { type: String, required: true, trim: true, uppercase: true, unique: true }, // e.g. 'US', 'UK'
        active: { type: Boolean, default: true },
        flagUrl: { type: String },
        description: { type: String },
    },
    { timestamps: true }
);

export const Country = mongoose.model<ICountry>('Country', CountrySchema);
