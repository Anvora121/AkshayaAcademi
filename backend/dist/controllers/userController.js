"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullProfile = exports.updateOnboarding = void 0;
const User_1 = require("../models/User");
const Preferences_1 = require("../models/Preferences");
const Education_1 = require("../models/Education");
const Documents_1 = require("../models/Documents");
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
                result = await Preferences_1.Preferences.findOneAndUpdate({ userId }, { userId, ...data }, { new: true, upsert: true });
                user.onboardingStep = Math.max(user.onboardingStep, 2);
                break;
            case 3: // Academic
                result = await Education_1.Education.findOneAndUpdate({ userId }, { userId, ...data }, { new: true, upsert: true });
                user.onboardingStep = Math.max(user.onboardingStep, 3);
                break;
            case 4: // Documents
                result = await Documents_1.Documents.findOneAndUpdate({ userId }, { userId, ...data }, { new: true, upsert: true });
                user.onboardingStep = Math.max(user.onboardingStep, 4);
                break;
            case 5: // Finalize
                user.onboardingComplete = true;
                user.onboardingStep = 5;
                break;
            default:
                // Personal details (Step 1 or subsequent cleanup)
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
const getFullProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.User.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const preferences = await Preferences_1.Preferences.findOne({ userId });
        const education = await Education_1.Education.findOne({ userId });
        const documents = await Documents_1.Documents.findOne({ userId });
        res.json({
            user,
            preferences: preferences || {},
            education: education || {},
            documents: documents || {},
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFullProfile = getFullProfile;
