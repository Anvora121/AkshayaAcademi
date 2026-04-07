import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPreferences extends Document {
  userId: Types.ObjectId;
  domain: string;
  preferredCountries: string[];
  preferredUniversities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PreferencesSchema = new Schema<IPreferences>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    domain: { type: String, trim: true, required: true },
    preferredCountries: [{ type: String, trim: true }],
    preferredUniversities: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export const Preferences = mongoose.model<IPreferences>('Preferences', PreferencesSchema);
