"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = exports.updateProfile = exports.getFullProfile = exports.updateOnboarding = void 0;
const User_1 = require("../models/User");
const Preferences_1 = require("../models/Preferences");
const Education_1 = require("../models/Education");
const Documents_1 = require("../models/Documents");
// ─── Onboarding ───────────────────────────────────────────────────────────────
const updateOnboarding = async (req, res) => {
    try {
        const userId = req.user.id;
        const { step, data } = req.body;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let result;
        switch (step) {
            case 2: // Preferences
                result = await Preferences_1.Preferences.findOneAndUpdate({ userId }, { userId, ...data }, { returnDocument: 'after', upsert: true });
                user.onboardingStep = Math.max(user.onboardingStep, 2);
                break;
            case 3: // Academic
                result = await Education_1.Education.findOneAndUpdate({ userId }, { userId, ...data }, { returnDocument: 'after', upsert: true });
                user.onboardingStep = Math.max(user.onboardingStep, 3);
                break;
            case 4: // Documents
                result = await Documents_1.Documents.findOneAndUpdate({ userId }, { userId, ...data }, { returnDocument: 'after', upsert: true });
                user.onboardingStep = Math.max(user.onboardingStep, 4);
                break;
            case 5: // Finalize
                user.onboardingComplete = true;
                user.onboardingStep = 5;
                break;
            default:
                // Personal details (Step 1)
                if (data.phone)
                    user.phone = data.phone;
                if (data.dob)
                    user.dob = new Date(data.dob);
                if (data.nationality)
                    user.nationality = data.nationality;
                if (data.name)
                    user.name = data.name;
                break;
        }
        await user.save();
        res.json({
            message: 'Onboarding progress saved',
            step: user.onboardingStep,
            complete: user.onboardingComplete,
            result,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateOnboarding = updateOnboarding;
// ─── Profile ──────────────────────────────────────────────────────────────────
/**
 * Returns a flat merged object for the current authenticated user.
 * Shape consumed by ProfileCard.tsx and the updated UserDashboard.
 */
const getFullProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await buildUserProfile(userId);
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFullProfile = getFullProfile;
/**
 * PUT /api/onboarding/profile — update the authenticated user's general profile fields.
 * Accepts a flat body with any mix of personal / preferences / education fields.
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;
        const user = await User_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Personal fields
        if (data.name !== undefined)
            user.name = data.name;
        if (data.phone !== undefined)
            user.phone = data.phone;
        if (data.nationality !== undefined)
            user.nationality = data.nationality;
        if (data.dob !== undefined)
            user.dob = new Date(data.dob);
        await user.save();
        // Preferences fields
        if (data.domain !== undefined || data.preferredCountries !== undefined || data.preferredUniversities !== undefined) {
            const prefUpdate = { userId };
            if (data.domain !== undefined)
                prefUpdate.domain = data.domain;
            if (data.preferredCountries !== undefined)
                prefUpdate.preferredCountries = data.preferredCountries;
            if (data.preferredUniversities !== undefined)
                prefUpdate.preferredUniversities = data.preferredUniversities;
            await Preferences_1.Preferences.findOneAndUpdate({ userId }, prefUpdate, { returnDocument: 'after', upsert: true });
        }
        // Education fields
        const eduFields = ['degree', 'specialization', 'college', 'cgpa', 'backlogs', 'testScores'];
        const eduUpdate = { userId };
        let hasEduUpdate = false;
        for (const f of eduFields) {
            if (data[f] !== undefined) {
                eduUpdate[f] = data[f];
                hasEduUpdate = true;
            }
        }
        if (hasEduUpdate) {
            await Education_1.Education.findOneAndUpdate({ userId }, eduUpdate, { returnDocument: 'after', upsert: true });
        }
        const updatedProfile = await buildUserProfile(userId);
        res.json({ message: 'Profile updated successfully', profile: updatedProfile });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProfile = updateProfile;
// ─── Admin ────────────────────────────────────────────────────────────────────
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.User.find({ role: { $ne: 'admin' } })
            .select('name email phone nationality role onboardingStep onboardingComplete subscriptionStatus createdAt')
            .lean();
        const userIds = users.map((u) => u._id);
        const [allPrefs, allEdus] = await Promise.all([
            Preferences_1.Preferences.find({ userId: { $in: userIds } }).lean(),
            Education_1.Education.find({ userId: { $in: userIds } }).lean(),
        ]);
        const prefsMap = Object.fromEntries(allPrefs.map((p) => [p.userId.toString(), p]));
        const edusMap = Object.fromEntries(allEdus.map((e) => [e.userId.toString(), e]));
        const enriched = users.map((u) => {
            const id = u._id.toString();
            return {
                ...u,
                preferences: prefsMap[id] || null,
                education: edusMap[id] || null,
            };
        });
        res.json(enriched);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const profile = await buildUserProfile(id);
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserById = getUserById;
// ─── Helpers ──────────────────────────────────────────────────────────────────
async function buildUserProfile(userId) {
    const user = await User_1.User.findById(userId).select('-passwordHash').lean();
    if (!user)
        return null;
    const [preferences, education, documents] = await Promise.all([
        Preferences_1.Preferences.findOne({ userId }).lean(),
        Education_1.Education.findOne({ userId }).lean(),
        Documents_1.Documents.findOne({ userId }).lean(),
    ]);
    // Return a flat merged object (what ProfileCard.tsx expects)
    return {
        // Personal
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        nationality: user.nationality,
        role: user.role,
        onboardingStep: user.onboardingStep,
        onboardingComplete: user.onboardingComplete,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt,
        // Preferences
        domain: preferences?.domain,
        preferredCountries: preferences?.preferredCountries ?? [],
        preferredUniversities: preferences?.preferredUniversities ?? [],
        // Education
        ugDegree: education?.degree,
        specialization: education?.specialization,
        college: education?.college,
        cgpa: education?.cgpa,
        backlogs: education?.backlogs ?? 0,
        testScores: education?.testScores ?? {},
        // Documents
        resumeURL: documents?.resumeURL,
        transcriptURL: documents?.transcriptURL,
        sopURL: documents?.sopURL,
    };
}
