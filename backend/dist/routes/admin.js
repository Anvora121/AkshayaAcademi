"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const News_1 = require("../models/News");
const NewsSource_1 = require("../models/NewsSource");
const CounselorLead_1 = require("../models/CounselorLead");
const rssAggregator_1 = require("../services/rssAggregator");
const router = express_1.default.Router();
// All admin routes require authentication + admin role
router.use(auth_1.verifyToken, (0, auth_1.requireRole)(['admin']));
// Users
router.get('/users', userController_1.getAllUsers);
router.get('/users/:id', userController_1.getUserById);
// Stats & Analytics
router.get('/stats', adminController_1.getStats);
router.get('/analytics', adminController_1.getAnalytics);
// Universities
router.get('/university', adminController_1.getUniversities);
router.post('/university', adminController_1.addUniversity);
router.delete('/university/:id', adminController_1.deleteUniversity);
// Countries
router.get('/country', adminController_1.getCountries);
router.post('/country', adminController_1.addCountry);
router.delete('/country/:id', adminController_1.deleteCountry);
// Applications
router.get('/application', adminController_1.getApplicationsTracker);
router.put('/application/:id/status', adminController_1.updateApplicationStatus);
// ── News CRUD ──────────────────────────────────────────────────
// GET all news (admin sees all statuses)
router.get('/news', async (req, res) => {
    try {
        const articles = await News_1.News.find()
            .sort({ createdAt: -1 })
            .select('-content');
        res.json(articles);
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
// POST create news
router.post('/news', async (req, res) => {
    try {
        const article = new News_1.News(req.body);
        await article.save();
        res.status(201).json(article);
    }
    catch (err) {
        res.status(400).json({ message: err.message || 'Validation Error' });
    }
});
// PUT update news
router.put('/news/:id', async (req, res) => {
    try {
        const article = await News_1.News.findByIdAndUpdate(req.params.id, { ...req.body }, { returnDocument: 'after', runValidators: true });
        if (!article)
            return res.status(404).json({ message: 'Article not found' });
        // Regenerate slug if title changed
        if (req.body.title) {
            await article.save(); // triggers pre-save hook
        }
        res.json(article);
    }
    catch (err) {
        res.status(400).json({ message: err.message || 'Update failed' });
    }
});
// DELETE news
router.delete('/news/:id', async (req, res) => {
    try {
        const article = await News_1.News.findByIdAndDelete(req.params.id);
        if (!article)
            return res.status(404).json({ message: 'Article not found' });
        res.json({ message: 'Article deleted' });
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
// ── News Sources (RSS) ─────────────────────────────────────────
const DEFAULT_SOURCES = [
    { universityName: 'Harvard University', rssUrl: 'https://news.harvard.edu/feed/', country: 'USA' },
    { universityName: 'MIT', rssUrl: 'https://news.mit.edu/rss/feed', country: 'USA' },
    { universityName: 'Stanford University', rssUrl: 'https://news.stanford.edu/feed/', country: 'USA' },
    { universityName: 'University of Oxford', rssUrl: 'https://www.ox.ac.uk/news/rss.xml', country: 'UK' },
    { universityName: 'University of Cambridge', rssUrl: 'https://www.cam.ac.uk/news/feed', country: 'UK' },
    { universityName: 'University of Toronto', rssUrl: 'https://www.utoronto.ca/news/feed', country: 'Canada' },
    { universityName: 'National University of Singapore', rssUrl: 'https://news.nus.edu.sg/feed/', country: 'Singapore' },
    { universityName: 'Australian National University', rssUrl: 'https://www.anu.edu.au/news/rss.xml', country: 'Australia' },
];
router.get('/news-sources', async (_req, res) => {
    try {
        const sources = await NewsSource_1.NewsSource.find().sort({ createdAt: -1 });
        res.json(sources);
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/news-sources', async (req, res) => {
    try {
        const source = new NewsSource_1.NewsSource(req.body);
        await source.save();
        res.status(201).json(source);
    }
    catch (err) {
        res.status(400).json({ message: err.message || 'Validation Error' });
    }
});
router.put('/news-sources/:id', async (req, res) => {
    try {
        const source = await NewsSource_1.NewsSource.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        if (!source)
            return res.status(404).json({ message: 'Source not found' });
        res.json(source);
    }
    catch (err) {
        res.status(400).json({ message: err.message || 'Update failed' });
    }
});
router.delete('/news-sources/:id', async (req, res) => {
    try {
        const source = await NewsSource_1.NewsSource.findByIdAndDelete(req.params.id);
        if (!source)
            return res.status(404).json({ message: 'Source not found' });
        res.json({ message: 'Source deleted' });
    }
    catch {
        res.status(500).json({ message: 'Server Error' });
    }
});
// Seed default university RSS sources (idempotent — skips existing)
router.post('/news-sources/seed', async (_req, res) => {
    try {
        const results = await Promise.all(DEFAULT_SOURCES.map(async (s) => {
            const exists = await NewsSource_1.NewsSource.findOne({ rssUrl: s.rssUrl });
            if (exists)
                return { skipped: true, name: s.universityName };
            const source = new NewsSource_1.NewsSource(s);
            await source.save();
            return { added: true, name: s.universityName };
        }));
        const added = results.filter((r) => r.added).length;
        const skipped = results.filter((r) => r.skipped).length;
        res.json({ message: `Seeded ${added} sources (${skipped} already existed)`, results });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Seed failed' });
    }
});
// Manual trigger: run RSS aggregation now
router.post('/news-sources/trigger', async (_req, res) => {
    res.json({ message: 'RSS aggregation started in background' }); // respond immediately
    (0, rssAggregator_1.runAggregator)().then(({ total, errors }) => {
        console.log(`[ADMIN] Manual RSS trigger: ${total} articles, ${errors.length} errors`);
    }).catch(console.error);
});
// GET counselor leads (admin only)
router.get('/counselor-lead', async (req, res) => {
    try {
        const { university } = req.query;
        const query = {};
        if (university) {
            query.university = university;
        }
        const leads = await CounselorLead_1.CounselorLead.find(query)
            .populate('user', 'name email')
            .populate('university', 'name id location')
            .sort({ createdAt: -1 });
        res.json(leads);
    }
    catch (error) {
        console.error('Error fetching counselor leads:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// PUT update status of counselor lead
router.put('/counselor-lead/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Contacted', 'Closed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const lead = await CounselorLead_1.CounselorLead.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
        if (!lead)
            return res.status(404).json({ message: 'Counselor lead not found' });
        res.json(lead);
    }
    catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.default = router;
