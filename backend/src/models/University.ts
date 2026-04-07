import mongoose, { Document, Schema } from 'mongoose';

export interface IUniversity extends Document {
    id: string; // The original slug/id from frontend (e.g. 'mit')
    name: string;
    country: string;
    countryName: string;
    location: string;
    ranking: number;
    rankingSource: 'QS' | 'THE';
    rankingUpdatedAt: string;
    featured: boolean;
    type: string;
    logo: string;
    image: string;
    description: string;
    founded: string;
    students: string;
    acceptanceRate: string;
    tuitionRange: string;
    requirements: {
        gpa: string;
        ielts: string;
        toefl: string;
        gre?: string;
        gmat?: string;
        other?: string;
    };
    careerOutcomes: {
        employmentRate: string;
        avgSalary: string;
        topEmployers: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const UniversitySchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, trim: true },
        country: { type: String, required: true, index: true },
        countryName: { type: String, required: true },
        location: { type: String, required: true },
        ranking: { type: Number, required: true, index: true },
        rankingSource: { type: String, required: true, enum: ['QS', 'THE'] },
        rankingUpdatedAt: { type: String, required: true },
        featured: { type: Boolean, default: false, index: true },
        type: { type: String },
        logo: { type: String },
        image: { type: String },
        description: { type: String },
        founded: { type: String },
        students: { type: String },
        acceptanceRate: { type: String },
        tuitionRange: { type: String },
        requirements: {
            gpa: { type: String },
            ielts: { type: String },
            toefl: { type: String },
            gre: { type: String },
            gmat: { type: String },
            other: { type: String },
        },
        careerOutcomes: {
            employmentRate: { type: String },
            avgSalary: { type: String },
            topEmployers: [{ type: String }],
        },
    },
    { timestamps: true }
);

export const University = mongoose.model<IUniversity>('University', UniversitySchema);
