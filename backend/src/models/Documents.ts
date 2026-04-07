import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDocuments extends Document {
  userId: Types.ObjectId;
  resumeURL?: string;
  transcriptURL?: string;
  sopURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentsSchema = new Schema<IDocuments>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    resumeURL: { type: String, trim: true },
    transcriptURL: { type: String, trim: true },
    sopURL: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Documents = mongoose.model<IDocuments>('Documents', DocumentsSchema);
