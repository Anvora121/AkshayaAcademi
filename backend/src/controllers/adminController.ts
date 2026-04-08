import { Request, Response } from 'express';
import { User } from '../models/User';
import { University } from '../models/University';
import { Country } from '../models/Country';
import { UniversityApplication } from '../models/UniversityApplication';

// ─── ANALYTICS & STATS ───────────────────────────────────────────────

export const getStats = async (req: Request, res: Response) => {
    try {
        const [totalUsers, totalApplications, totalUniversities, totalCountries] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            UniversityApplication.countDocuments(),
            University.countDocuments(),
            Country.countDocuments()
        ]);

        res.json({
            totalUsers,
            totalApplications,
            totalUniversities,
            totalCountries
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        // 1. Applications over time (last 30 days grouped by day)
        const appsOverTime = await UniversityApplication.aggregate([
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
        const usersByCountry = await User.aggregate([
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
        const domainInterest = await User.aggregate([
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
        const appStatus = await UniversityApplication.aggregate([
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
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ─── UNIVERSITIES CRUD ───────────────────────────────────────────────

export const getUniversities = async (req: Request, res: Response) => {
    try {
        const unis = await University.find().sort({ ranking: 1 });
        res.json(unis);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addUniversity = async (req: Request, res: Response) => {
    try {
        const uni = new University(req.body);
        await uni.save();
        res.status(201).json(uni);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUniversity = async (req: Request, res: Response) => {
    try {
        await University.findByIdAndDelete(req.params.id);
        res.json({ message: 'University deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ─── COUNTRIES CRUD ──────────────────────────────────────────────────

export const getCountries = async (req: Request, res: Response) => {
    try {
        const countries = await Country.find().sort({ name: 1 });
        res.json(countries);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addCountry = async (req: Request, res: Response) => {
    try {
        const country = new Country(req.body);
        await country.save();
        res.status(201).json(country);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCountry = async (req: Request, res: Response) => {
    try {
        await Country.findByIdAndDelete(req.params.id);
        res.json({ message: 'Country deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ─── APPLICATIONS TRACKING ──────────────────────────────────────────

export const getApplicationsTracker = async (req: Request, res: Response) => {
    try {
        const apps = await UniversityApplication.find()
            .populate('user', 'name email phone')
            .populate('university', 'name country')
            .populate('country', 'name')
            .sort({ appliedAt: -1 });
        res.json(apps);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const app = await UniversityApplication.findByIdAndUpdate(id, { status }, { new: true });
        res.json(app);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
