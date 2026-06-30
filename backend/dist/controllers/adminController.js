"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getApplicationsTracker = exports.deleteCountry = exports.addCountry = exports.getCountries = exports.deleteUniversity = exports.addUniversity = exports.getUniversities = exports.getAnalytics = exports.getStats = void 0;
const User_1 = require("../models/User");
const University_1 = require("../models/University");
const Country_1 = require("../models/Country");
const UniversityApplication_1 = require("../models/UniversityApplication");
// ─── ANALYTICS & STATS ───────────────────────────────────────────────
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalApplications, totalUniversities, totalCountries] = await Promise.all([
            User_1.User.countDocuments({ role: 'user' }),
            UniversityApplication_1.UniversityApplication.countDocuments(),
            University_1.University.countDocuments(),
            Country_1.Country.countDocuments()
        ]);
        res.json({
            totalUsers,
            totalApplications,
            totalUniversities,
            totalCountries
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getStats = getStats;
const getAnalytics = async (req, res) => {
    try {
        // 1. Applications over time (last 30 days grouped by day)
        const appsOverTime = await UniversityApplication_1.UniversityApplication.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
        ]);
        // 2. Users by preferred country
        // Since preferredCountries is an array of strings in User model:
        const usersByCountry = await User_1.User.aggregate([
            { $match: { role: 'user' } },
            { $unwind: "$preferredCountries" },
            {
                $group: {
                    _id: "$preferredCountries",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        // 3. Domain interest distribution
        const domainInterest = await User_1.User.aggregate([
            { $match: { role: 'user', domain: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: "$domain",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        // 4. Application Status distribution
        const appStatus = await UniversityApplication_1.UniversityApplication.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json({
            applicationsOverTime: appsOverTime.map(x => ({ date: x._id, count: x.count })),
            usersByCountry: usersByCountry.map(x => ({ country: x._id, count: x.count })),
            domainInterest: domainInterest.map(x => ({ domain: x._id, count: x.count })),
            applicationStatus: appStatus.map(x => ({ status: x._id, count: x.count }))
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAnalytics = getAnalytics;
// ─── UNIVERSITIES CRUD ───────────────────────────────────────────────
const getUniversities = async (req, res) => {
    try {
        const unis = await University_1.University.find().sort({ ranking: 1 });
        res.json(unis);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUniversities = getUniversities;
const addUniversity = async (req, res) => {
    try {
        const uni = new University_1.University(req.body);
        await uni.save();
        res.status(201).json(uni);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addUniversity = addUniversity;
const deleteUniversity = async (req, res) => {
    try {
        await University_1.University.findByIdAndDelete(req.params.id);
        res.json({ message: 'University deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteUniversity = deleteUniversity;
// ─── COUNTRIES CRUD ──────────────────────────────────────────────────
const getCountries = async (req, res) => {
    try {
        const countries = await Country_1.Country.find().sort({ name: 1 });
        res.json(countries);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCountries = getCountries;
const addCountry = async (req, res) => {
    try {
        const country = new Country_1.Country(req.body);
        await country.save();
        res.status(201).json(country);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addCountry = addCountry;
const deleteCountry = async (req, res) => {
    try {
        await Country_1.Country.findByIdAndDelete(req.params.id);
        res.json({ message: 'Country deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteCountry = deleteCountry;
// ─── APPLICATIONS TRACKING ──────────────────────────────────────────
const getApplicationsTracker = async (req, res) => {
    try {
        const apps = await UniversityApplication_1.UniversityApplication.find()
            .populate('user', 'name email phone')
            .populate('university', 'name country')
            .populate('country', 'name')
            .sort({ appliedAt: -1 });
        res.json(apps);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getApplicationsTracker = getApplicationsTracker;
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const app = await UniversityApplication_1.UniversityApplication.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
        res.json(app);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
