import express, { Request, Response } from 'express';
import { getAllUsers, getUserById } from '../controllers/userController';
import {
    getStats, getAnalytics,
    getUniversities, addUniversity, deleteUniversity,
    getCountries, addCountry, deleteCountry,
    getApplicationsTracker, updateApplicationStatus
} from '../controllers/adminController';
import { verifyToken, requireRole } from '../middleware/auth';
import { News } from '../models/News';
import { NewsSource } from '../models/NewsSource';
import { CounselorLead } from '../models/CounselorLead';
import { runAggregator } from '../services/rssAggregator';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(verifyToken, requireRole(['admin']));

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// Stats & Analytics
router.get('/stats', getStats);
router.get('/analytics', getAnalytics);

// Universities
router.get('/university', getUniversities);
router.post('/university', addUniversity);
router.delete('/university/:id', deleteUniversity);

// Countries
router.get('/country', getCountries);
router.post('/country', addCountry);
router.delete('/country/:id', deleteCountry);

// Applications
router.get('/application', getApplicationsTracker);
router.put('/application/:id/status', updateApplicationStatus);

// ── News CRUD ──────────────────────────────────────────────────

// GET all news (admin sees all statuses)
router.get('/news', async (req: Request, res: Response) => {
    try {
        const articles = await News.find()
            .sort({ createdAt: -1 })
            .select('-content');
        res.json(articles);
    } catch {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST create news
router.post('/news', async (req: Request, res: Response) => {
    try {
        const article = new News(req.body);
        await article.save();
        res.status(201).json(article);
    } catch (err: any) {
        res.status(400).json({ message: err.message || 'Validation Error' });
    }
});

// PUT update news
router.put('/news/:id', async (req: Request, res: Response) => {
    try {
        const article = await News.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { returnDocument: 'after', runValidators: true }
        );
        if (!article) return res.status(404).json({ message: 'Article not found' });
        // Regenerate slug if title changed
        if (req.body.title) {
            await article.save(); // triggers pre-save hook
        }
        res.json(article);
    } catch (err: any) {
        res.status(400).json({ message: err.message || 'Update failed' });
    }
});

// DELETE news
router.delete('/news/:id', async (req: Request, res: Response) => {
    try {
        const article = await News.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json({ message: 'Article deleted' });
    } catch {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ── News Sources (RSS) ─────────────────────────────────────────

const DEFAULT_SOURCES = [
    { universityName: 'Harvard University',             rssUrl: 'https://news.harvard.edu/feed/',                country: 'USA' },
    { universityName: 'MIT',                            rssUrl: 'https://news.mit.edu/rss/feed',                 country: 'USA' },
    { universityName: 'Stanford University',            rssUrl: 'https://news.stanford.edu/feed/',               country: 'USA' },
    { universityName: 'University of Oxford',           rssUrl: 'https://www.ox.ac.uk/news/rss.xml',            country: 'UK'  },
    { universityName: 'University of Cambridge',        rssUrl: 'https://www.cam.ac.uk/news/feed',              country: 'UK'  },
    { universityName: 'University of Toronto',          rssUrl: 'https://www.utoronto.ca/news/feed',            country: 'Canada' },
    { universityName: 'National University of Singapore', rssUrl: 'https://news.nus.edu.sg/feed/',              country: 'Singapore' },
    { universityName: 'Australian National University', rssUrl: 'https://www.anu.edu.au/news/rss.xml',         country: 'Australia' },
];

router.get('/news-sources', async (_req: Request, res: Response) => {
    try {
        const sources = await NewsSource.find().sort({ createdAt: -1 });
        res.json(sources);
    } catch {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/news-sources', async (req: Request, res: Response) => {
    try {
        const source = new NewsSource(req.body);
        await source.save();
        res.status(201).json(source);
    } catch (err: any) {
        res.status(400).json({ message: err.message || 'Validation Error' });
    }
});

router.put('/news-sources/:id', async (req: Request, res: Response) => {
    try {
        const source = await NewsSource.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        if (!source) return res.status(404).json({ message: 'Source not found' });
        res.json(source);
    } catch (err: any) {
        res.status(400).json({ message: err.message || 'Update failed' });
    }
});

router.delete('/news-sources/:id', async (req: Request, res: Response) => {
    try {
        const source = await NewsSource.findByIdAndDelete(req.params.id);
        if (!source) return res.status(404).json({ message: 'Source not found' });
        res.json({ message: 'Source deleted' });
    } catch {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Seed default university RSS sources (idempotent — skips existing)
router.post('/news-sources/seed', async (_req: Request, res: Response) => {
    try {
        const results = await Promise.all(
            DEFAULT_SOURCES.map(async (s) => {
                const exists = await NewsSource.findOne({ rssUrl: s.rssUrl });
                if (exists) return { skipped: true, name: s.universityName };
                const source = new NewsSource(s);
                await source.save();
                return { added: true, name: s.universityName };
            })
        );
        const added = results.filter((r) => r.added).length;
        const skipped = results.filter((r) => r.skipped).length;
        res.json({ message: `Seeded ${added} sources (${skipped} already existed)`, results });
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Seed failed' });
    }
});

// Manual trigger: run RSS aggregation now
router.post('/news-sources/trigger', async (_req: Request, res: Response) => {
    res.json({ message: 'RSS aggregation started in background' }); // respond immediately
    runAggregator().then(({ total, errors }) => {
        console.log(`[ADMIN] Manual RSS trigger: ${total} articles, ${errors.length} errors`);
    }).catch(console.error);
});

// GET counselor leads (admin only)
router.get('/counselor-lead', async (req: Request, res: Response) => {
    try {
        const { university } = req.query;
        const query: any = {};
        if (university) {
            query.university = university;
        }
        const leads = await CounselorLead.find(query)
            .populate('user', 'name email')
            .populate('university', 'name id location')
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        console.error('Error fetching counselor leads:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT update status of counselor lead
router.put('/counselor-lead/:id/status', async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Contacted', 'Closed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const lead = await CounselorLead.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: 'after' }
        );
        if (!lead) return res.status(404).json({ message: 'Counselor lead not found' });
        res.json(lead);
    } catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
