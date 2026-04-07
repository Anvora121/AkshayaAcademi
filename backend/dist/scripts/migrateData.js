"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const University_1 = require("../models/University");
const Course_1 = require("../models/Course");
const normalizeTuition = (tuition) => {
    if (!tuition)
        return 0;
    // Remove currencies, commas, and per year markers
    const numericStr = tuition.replace(/[$,£€CAD\s,]/g, '').split('/')[0].split('-')[0];
    const val = parseInt(numericStr);
    return isNaN(val) ? 0 : val;
};
const extractCurrency = (tuition) => {
    if (tuition.includes('$'))
        return tuition.includes('CAD') ? 'CAD' : 'USD';
    if (tuition.includes('£'))
        return 'GBP';
    if (tuition.includes('€'))
        return 'EUR';
    return 'USD';
};
const runMigration = async () => {
    try {
        const envPath = path_1.default.join(process.cwd(), '.env');
        console.log('Env path:', envPath);
        if (fs_1.default.existsSync(envPath)) {
            const envContent = fs_1.default.readFileSync(envPath, 'utf-8');
            const match = envContent.match(/MONGODB_URI=(.*)/);
            if (match && match[1]) {
                process.env.MONGODB_URI = match[1].trim();
                console.log('Manually loaded MONGODB_URI');
            }
        }
        if (!process.env.MONGODB_URI) {
            console.error('ERROR: MONGODB_URI is not defined in .env');
            process.exit(1);
        }
        console.log('Connecting to database...');
        try {
            await mongoose_1.default.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 10000,
            });
            console.log('Connected to MongoDB successfully!');
        }
        catch (connErr) {
            console.error('MongoDB Connection Error:', connErr.message);
            process.exit(1);
        }
        // Clear existing data
        await University_1.University.deleteMany({});
        await Course_1.Course.deleteMany({});
        console.log('Cleared existing University and Course data');
        // Read JSON data
        const dataPath = path_1.default.resolve(process.cwd(), '..', 'universities.json');
        console.log('Reading data from:', dataPath);
        const rawData = fs_1.default.readFileSync(dataPath, 'utf-8');
        const universities = JSON.parse(rawData);
        console.log(`Migrating ${universities.length} universities...`);
        for (const uniData of universities) {
            // 1. Create University
            const university = new University_1.University({
                id: uniData.id,
                name: uniData.name,
                country: uniData.country,
                countryName: uniData.countryName,
                location: uniData.location,
                ranking: uniData.ranking,
                rankingSource: uniData.rankingSource || 'QS',
                rankingUpdatedAt: uniData.rankingUpdatedAt || new Date().toISOString(),
                featured: uniData.featured || false,
                type: uniData.type,
                logo: uniData.logo,
                image: uniData.image,
                description: uniData.description,
                founded: uniData.founded,
                students: uniData.students,
                acceptanceRate: uniData.acceptanceRate,
                tuitionRange: uniData.tuitionRange,
                requirements: uniData.requirements,
                careerOutcomes: uniData.careerOutcomes,
            });
            const savedUni = await university.save();
            // 2. Create Courses from popularPrograms
            if (uniData.popularPrograms && Array.isArray(uniData.popularPrograms)) {
                const courses = uniData.popularPrograms.map((prog) => ({
                    university: savedUni._id,
                    name: prog.name,
                    duration: prog.duration,
                    degreeLevel: prog.type.includes('Bachelor') ? 'Bachelor\'s' :
                        prog.type.includes('Master') ? 'Master\'s' :
                            prog.type.includes('Doctorate') || prog.type.includes('PhD') ? 'Doctorate' : 'Other',
                    tuitionFee: normalizeTuition(uniData.tuitionRange),
                    tuitionCurrency: extractCurrency(uniData.tuitionRange),
                    tuitionOriginal: uniData.tuitionRange,
                    intakeMonths: ['September', 'January'],
                    description: `${prog.name} program at ${uniData.name}`,
                }));
                await Course_1.Course.insertMany(courses);
            }
        }
        console.log('Migration completed successfully!');
        process.exit(0);
    }
    catch (err) {
        console.error('Migration failed with unexpected error:', err.message);
        console.error(err.stack);
        process.exit(1);
    }
};
runMigration();
