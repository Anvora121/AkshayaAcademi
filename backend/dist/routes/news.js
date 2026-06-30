"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const News_1 = require("../models/News");
const newsRecommendations_1 = require("../services/newsRecommendations");
const router = express_1.default.Router();
// Extract userId from cookie without requiring auth (returns null if not logged in)
function tryGetUserId(req) {
    const token = req.cookies?.token;
    if (!token)
        return null;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded.id || decoded._id || null;
    }
    catch {
        return null;
    }
}
// @route   GET /api/news/recommended
// @desc    Personalized news for logged-in student; popular news for guests
// @access  Public (enhanced for auth users)
router.get('/recommended', async (req, res) => {
    try {
        const userId = tryGetUserId(req);
        const limit = Math.min(12, Math.max(3, parseInt(req.query.limit) || 6));
        const articles = await (0, newsRecommendations_1.getRecommendedNews)(userId, limit);
        res.json(articles);
    }
    catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/news
// @desc    Get published news with search, filters, pagination
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { page = '1', limit = '9', category, country, search, featured, universityName, } = req.query;
        const query = { status: 'published' };
        if (category && category !== 'all')
            query.category = category;
        if (country && country !== 'all')
            query.country = country;
        if (universityName)
            query.universityName = { $regex: universityName, $options: 'i' };
        if (featured === 'true')
            query.featured = true;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }
        const p = Math.max(1, parseInt(page) || 1);
        const l = Math.min(50, Math.max(1, parseInt(limit) || 9));
        const skip = (p - 1) * l;
        const [total, articles] = await Promise.all([
            News_1.News.countDocuments(query),
            News_1.News.find(query)
                .sort({ featured: -1, publishDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(l)
                .select('-content'),
        ]);
        res.json({
            articles,
            pagination: { total, page: p, pages: Math.ceil(total / l), limit: l },
        });
    }
    catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route   GET /api/news/:slug
// @desc    Get single news article by slug, increment view count
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const article = await News_1.News.findOneAndUpdate({ slug: req.params.slug, status: 'published' }, { $inc: { views: 1 } }, { returnDocument: 'after' });
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        const related = await News_1.News.find({
            status: 'published',
            category: article.category,
            _id: { $ne: article._id },
        })
            .sort({ publishDate: -1, createdAt: -1 })
            .limit(3)
            .select('-content');
        res.json({ article, related });
    }
    catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.default = router;
