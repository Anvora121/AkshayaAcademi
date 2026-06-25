import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { News } from '../models/News';
import { getRecommendedNews } from '../services/newsRecommendations';

const router = express.Router();

// Extract userId from cookie without requiring auth (returns null if not logged in)
function tryGetUserId(req: Request): string | null {
    const token = (req as any).cookies?.token;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        return decoded.id || decoded._id || null;
    } catch {
        return null;
    }
}

// @route   GET /api/news/recommended
// @desc    Personalized news for logged-in student; popular news for guests
// @access  Public (enhanced for auth users)
router.get('/recommended', async (req: Request, res: Response) => {
    try {
        const userId = tryGetUserId(req);
        const limit = Math.min(12, Math.max(3, parseInt(req.query.limit as string) || 6));
        const articles = await getRecommendedNews(userId, limit);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/news
// @desc    Get published news with search, filters, pagination
// @access  Public
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            page = '1',
            limit = '9',
            category,
            country,
            search,
            featured,
            universityName,
        } = req.query;

        const query: any = { status: 'published' };

        if (category && category !== 'all') query.category = category;
        if (country && country !== 'all') query.country = country;
        if (universityName) query.universityName = { $regex: universityName, $options: 'i' };
        if (featured === 'true') query.featured = true;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search as string, 'i')] } },
            ];
        }

        const p = Math.max(1, parseInt(page as string) || 1);
        const l = Math.min(50, Math.max(1, parseInt(limit as string) || 9));
        const skip = (p - 1) * l;

        const [total, articles] = await Promise.all([
            News.countDocuments(query),
            News.find(query)
                .sort({ featured: -1, publishDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(l)
                .select('-content'),
        ]);

        res.json({
            articles,
            pagination: { total, page: p, pages: Math.ceil(total / l), limit: l },
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/news/:slug
// @desc    Get single news article by slug, increment view count
// @access  Public
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const article = await News.findOneAndUpdate(
            { slug: req.params.slug, status: 'published' },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const related = await News.find({
            status: 'published',
            category: article.category,
            _id: { $ne: article._id },
        })
            .sort({ publishDate: -1, createdAt: -1 })
            .limit(3)
            .select('-content');

        res.json({ article, related });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
