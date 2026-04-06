import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User';
import { UniversityFeedback } from './models/UniversityFeedback';
import { PlacementOffer } from './models/PlacementOffer';

dotenv.config();

// ─────────────────────────────────────────────────────────────
// FEEDBACK DATA
// ─────────────────────────────────────────────────────────────
const feedbackSeed = [
    // MIT
    { universityId: 'mit', reviewerName: 'Arjun Sharma', reviewerType: 'alumni', rating: 5, reviewText: 'MIT exceeded every expectation. The research opportunities are unparalleled, and the network you build here opens doors worldwide.', intakeYear: 2021, moderationStatus: 'approved' },
    { universityId: 'mit', reviewerName: 'Priya Nair', reviewerType: 'student', rating: 5, reviewText: 'Incredible professors and an amazing research culture. Campus life is vibrant and the AI lab resources are phenomenal.', intakeYear: 2023, moderationStatus: 'approved' },
    { universityId: 'mit', reviewerName: 'Rahul Menon', reviewerType: 'alumni', rating: 4, reviewText: 'Very competitive environment but immensely rewarding. The cost of living in Cambridge is high but the career support is excellent.', intakeYear: 2020, moderationStatus: 'approved' },
    // Stanford
    { universityId: 'stanford', reviewerName: 'Sneha Patel', reviewerType: 'alumni', rating: 5, reviewText: 'Being at Stanford in Silicon Valley is a game-changer. The entrepreneurial spirit is everywhere — I started my startup here.', intakeYear: 2020, moderationStatus: 'approved' },
    { universityId: 'stanford', reviewerName: 'Vikram Iyer', reviewerType: 'student', rating: 5, reviewText: "Stanford's Data Science program offers hands-on industry exposure. Faculty are world-renowned researchers who are incredibly approachable.", intakeYear: 2022, moderationStatus: 'approved' },
    // Harvard
    { universityId: 'harvard', reviewerName: 'Ananya Krishnan', reviewerType: 'alumni', rating: 5, reviewText: 'The Harvard brand carries incredible weight globally. The MBA case study method is intense but the peer learning is exceptional.', intakeYear: 2019, moderationStatus: 'approved' },
    { universityId: 'harvard', reviewerName: 'Ravi Subramanian', reviewerType: 'student', rating: 4, reviewText: 'Academically rigorous and socially diverse. Housing can be challenging but the university support system is strong.', intakeYear: 2023, moderationStatus: 'approved' },
    // Oxford
    { universityId: 'oxford', reviewerName: 'Deepak Ramesh', reviewerType: 'alumni', rating: 5, reviewText: 'The tutorial system at Oxford is unique in the world. Weekly one-on-one discussions with experts is something no other university offers.', intakeYear: 2020, moderationStatus: 'approved' },
    { universityId: 'oxford', reviewerName: 'Kavya Reddy', reviewerType: 'student', rating: 5, reviewText: 'Oxford is in a league of its own. The PPE program gave me a broad foundation that employers globally respect.', intakeYear: 2022, moderationStatus: 'approved' },
    // Cambridge
    { universityId: 'cambridge', reviewerName: 'Ajay Pillai', reviewerType: 'alumni', rating: 5, reviewText: "Cambridge's research culture is second to none. Being surrounded by Nobel laureates on a daily basis is surreal.", intakeYear: 2019, moderationStatus: 'approved' },
    // Imperial
    { universityId: 'imperial', reviewerName: 'Suresh Kumar', reviewerType: 'alumni', rating: 4, reviewText: "Imperial's Computing program is extremely rigorous. Strong industry links — multiple internship offers came through campus connections alone.", intakeYear: 2021, moderationStatus: 'approved' },
    // Toronto
    { universityId: 'toronto', reviewerName: 'Meena Gopalan', reviewerType: 'alumni', rating: 4, reviewText: 'U of T is the best value for money among top global universities. The CS program is world-class.', intakeYear: 2020, moderationStatus: 'approved' },
    { universityId: 'toronto', reviewerName: 'Karthik Venkat', reviewerType: 'student', rating: 5, reviewText: 'The AI and ML research at U of T is world-leading. Toronto is incredibly multicultural and welcoming to Indian students.', intakeYear: 2023, moderationStatus: 'approved' },
];

// ─────────────────────────────────────────────────────────────
// PLACEMENT DATA
// ─────────────────────────────────────────────────────────────
const placementSeed = [
    // MIT
    { universityId: 'mit', universityName: 'MIT', country: 'us', companyName: 'Google', role: 'Software Engineer', offerType: 'full-time', ctcMin: 180000, ctcMax: 220000, currency: 'USD', location: 'Mountain View, CA', batchYear: 2024 },
    { universityId: 'mit', universityName: 'MIT', country: 'us', companyName: 'Apple', role: 'ML Engineer', offerType: 'full-time', ctcMin: 170000, ctcMax: 210000, currency: 'USD', location: 'Cupertino, CA', batchYear: 2024 },
    { universityId: 'mit', universityName: 'MIT', country: 'us', companyName: 'Amazon', role: 'Senior SDE', offerType: 'full-time', ctcMin: 160000, ctcMax: 200000, currency: 'USD', location: 'Seattle, WA', batchYear: 2024 },
    { universityId: 'mit', universityName: 'MIT', country: 'us', companyName: 'Goldman Sachs', role: 'Quantitative Analyst', offerType: 'full-time', ctcMin: 175000, ctcMax: 225000, currency: 'USD', location: 'New York, NY', batchYear: 2023 },
    { universityId: 'mit', universityName: 'MIT', country: 'us', companyName: 'Google', role: 'SWE Intern', offerType: 'intern', ctcMin: 45000, ctcMax: 55000, currency: 'USD', location: 'Remote', batchYear: 2024 },
    // Stanford
    { universityId: 'stanford', universityName: 'Stanford University', country: 'us', companyName: 'Meta', role: 'Software Engineer', offerType: 'full-time', ctcMin: 175000, ctcMax: 215000, currency: 'USD', location: 'Menlo Park, CA', batchYear: 2024 },
    { universityId: 'stanford', universityName: 'Stanford University', country: 'us', companyName: 'Tesla', role: 'Data Scientist', offerType: 'full-time', ctcMin: 145000, ctcMax: 185000, currency: 'USD', location: 'Austin, TX', batchYear: 2024 },
    { universityId: 'stanford', universityName: 'Stanford University', country: 'us', companyName: 'McKinsey', role: 'Business Analyst', offerType: 'full-time', ctcMin: 165000, ctcMax: 200000, currency: 'USD', location: 'New York, NY', batchYear: 2023 },
    // Harvard
    { universityId: 'harvard', universityName: 'Harvard University', country: 'us', companyName: 'McKinsey', role: 'Associate Consultant', offerType: 'full-time', ctcMin: 165000, ctcMax: 200000, currency: 'USD', location: 'New York, NY', batchYear: 2024 },
    { universityId: 'harvard', universityName: 'Harvard University', country: 'us', companyName: 'Goldman Sachs', role: 'IB Analyst', offerType: 'full-time', ctcMin: 150000, ctcMax: 200000, currency: 'USD', location: 'New York, NY', batchYear: 2024 },
    { universityId: 'harvard', universityName: 'Harvard University', country: 'us', companyName: 'BCG', role: 'Consultant', offerType: 'full-time', ctcMin: 160000, ctcMax: 195000, currency: 'USD', location: 'Boston, MA', batchYear: 2024 },
    // UC Berkeley
    { universityId: 'ucberkeley', universityName: 'UC Berkeley', country: 'us', companyName: 'Google', role: 'Software Engineer', offerType: 'full-time', ctcMin: 155000, ctcMax: 195000, currency: 'USD', location: 'Mountain View, CA', batchYear: 2024 },
    { universityId: 'ucberkeley', universityName: 'UC Berkeley', country: 'us', companyName: 'Salesforce', role: 'Full Stack Engineer', offerType: 'full-time', ctcMin: 135000, ctcMax: 170000, currency: 'USD', location: 'San Francisco, CA', batchYear: 2024 },
    // UCLA
    { universityId: 'ucla', universityName: 'UCLA', country: 'us', companyName: 'Disney', role: 'UX Engineer', offerType: 'full-time', ctcMin: 120000, ctcMax: 155000, currency: 'USD', location: 'Burbank, CA', batchYear: 2024 },
    { universityId: 'ucla', universityName: 'UCLA', country: 'us', companyName: 'Amazon', role: 'SDE', offerType: 'full-time', ctcMin: 140000, ctcMax: 175000, currency: 'USD', location: 'Los Angeles, CA', batchYear: 2024 },
    // Oxford
    { universityId: 'oxford', universityName: 'University of Oxford', country: 'uk', companyName: 'McKinsey', role: 'Business Analyst', offerType: 'full-time', ctcMin: 65000, ctcMax: 80000, currency: 'GBP', location: 'London, UK', batchYear: 2024 },
    { universityId: 'oxford', universityName: 'University of Oxford', country: 'uk', companyName: 'Goldman Sachs', role: 'Analyst', offerType: 'full-time', ctcMin: 70000, ctcMax: 90000, currency: 'GBP', location: 'London, UK', batchYear: 2024 },
    { universityId: 'oxford', universityName: 'University of Oxford', country: 'uk', companyName: 'Google', role: 'UX Researcher', offerType: 'full-time', ctcMin: 60000, ctcMax: 75000, currency: 'GBP', location: 'London, UK', batchYear: 2024 },
    // Cambridge
    { universityId: 'cambridge', universityName: 'University of Cambridge', country: 'uk', companyName: 'ARM', role: 'Chip Design Engineer', offerType: 'full-time', ctcMin: 65000, ctcMax: 82000, currency: 'GBP', location: 'Cambridge, UK', batchYear: 2024 },
    { universityId: 'cambridge', universityName: 'University of Cambridge', country: 'uk', companyName: 'Google', role: 'Software Engineer', offerType: 'full-time', ctcMin: 75000, ctcMax: 95000, currency: 'GBP', location: 'London, UK', batchYear: 2024 },
    // Imperial
    { universityId: 'imperial', universityName: 'Imperial College London', country: 'uk', companyName: 'JP Morgan', role: 'Quantitative Developer', offerType: 'full-time', ctcMin: 70000, ctcMax: 90000, currency: 'GBP', location: 'London, UK', batchYear: 2024 },
    { universityId: 'imperial', universityName: 'Imperial College London', country: 'uk', companyName: 'Amazon', role: 'Software Engineer', offerType: 'full-time', ctcMin: 65000, ctcMax: 82000, currency: 'GBP', location: 'London, UK', batchYear: 2024 },
    { universityId: 'imperial', universityName: 'Imperial College London', country: 'uk', companyName: 'Google', role: 'SWE Intern', offerType: 'intern', ctcMin: 20000, ctcMax: 28000, currency: 'GBP', location: 'London, UK', batchYear: 2024 },
    // LSE
    { universityId: 'lse', universityName: 'London School of Economics', country: 'uk', companyName: 'KPMG', role: 'Financial Analyst', offerType: 'full-time', ctcMin: 52000, ctcMax: 68000, currency: 'GBP', location: 'London, UK', batchYear: 2024 },
    { universityId: 'lse', universityName: 'London School of Economics', country: 'uk', companyName: 'Deutsche Bank', role: 'Analyst', offerType: 'full-time', ctcMin: 58000, ctcMax: 75000, currency: 'GBP', location: 'London, UK', batchYear: 2023 },
    // Toronto
    { universityId: 'toronto', universityName: 'University of Toronto', country: 'canada', companyName: 'Google', role: 'Software Engineer', offerType: 'full-time', ctcMin: 110000, ctcMax: 145000, currency: 'CAD', location: 'Waterloo, ON', batchYear: 2024 },
    { universityId: 'toronto', universityName: 'University of Toronto', country: 'canada', companyName: 'Microsoft', role: 'Cloud Engineer', offerType: 'full-time', ctcMin: 100000, ctcMax: 135000, currency: 'CAD', location: 'Vancouver, BC', batchYear: 2024 },
    // UBC
    { universityId: 'ubc', universityName: 'University of British Columbia', country: 'canada', companyName: 'Amazon', role: 'SDE', offerType: 'full-time', ctcMin: 105000, ctcMax: 140000, currency: 'CAD', location: 'Vancouver, BC', batchYear: 2024 },
    { universityId: 'ubc', universityName: 'University of British Columbia', country: 'canada', companyName: 'Hootsuite', role: 'Full Stack Developer', offerType: 'full-time', ctcMin: 82000, ctcMax: 110000, currency: 'CAD', location: 'Vancouver, BC', batchYear: 2024 },
];

// ─────────────────────────────────────────────────────────────
// MAIN SEED RUNNER
// ─────────────────────────────────────────────────────────────
const seedDatabase = async () => {
    if (!process.env.MONGODB_URI) {
        console.error('FATAL ERROR: MONGODB_URI is not defined.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // ── Users ──────────────────────────────────────────────
        await User.deleteMany({});
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('123456', salt);

        const users = [
            { name: 'System Admin', email: 'admin@test.com', passwordHash, role: 'admin', subscriptionStatus: 'active' },
            { name: 'Premium Member', email: 'sub@test.com', passwordHash, role: 'subscribed', subscriptionStatus: 'active', subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            { name: 'Regular User', email: 'user@test.com', passwordHash, role: 'user', subscriptionStatus: 'inactive' },
        ];
        await User.insertMany(users);
        console.log('✅ Users seeded: admin@test.com | sub@test.com | user@test.com  (all password: 123456)');

        // ── Feedback ───────────────────────────────────────────
        await UniversityFeedback.deleteMany({});
        await UniversityFeedback.insertMany(feedbackSeed);
        console.log(`✅ Feedback seeded: ${feedbackSeed.length} entries`);

        // ── Placements ─────────────────────────────────────────
        await PlacementOffer.deleteMany({});
        await PlacementOffer.insertMany(placementSeed);
        const uniCount = new Set(placementSeed.map((p) => p.universityId)).size;
        console.log(`✅ Placements seeded: ${placementSeed.length} offers across ${uniCount} universities`);

        console.log('\n🌱 Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
