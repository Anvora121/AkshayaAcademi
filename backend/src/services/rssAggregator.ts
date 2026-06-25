import Parser from 'rss-parser';
import { News } from '../models/News';
import { NewsSource, INewsSource } from '../models/NewsSource';
import { generateAiSummary, categorizeArticle } from './aiSummarizer';

const parser = new Parser({
    timeout: 12_000,
    maxRedirects: 5,
    headers: { 'User-Agent': 'AkshayaAkademics-NewsBot/1.0' },
});

export async function fetchAndSaveSource(source: INewsSource): Promise<number> {
    const feed = await parser.parseURL(source.rssUrl);
    let saved = 0;

    for (const item of feed.items.slice(0, 15)) {
        if (!item.title) continue;

        // Deduplicate by source URL or identical title
        const dupQuery: any[] = [{ title: item.title }];
        if (item.link) dupQuery.push({ sourceUrl: item.link });
        const exists = await News.findOne({ $or: dupQuery });
        if (exists) continue;

        const rawContent = item.content || item.contentSnippet || item.summary || '';
        const textForAI = rawContent.slice(0, 3000);

        // Run AI in parallel; graceful fallback if Groq is unavailable
        const [aiSummary, category] = await Promise.all([
            generateAiSummary(item.title, textForAI).catch(() => ''),
            categorizeArticle(item.title, textForAI).catch(() => 'General Education'),
        ]);

        const summary = (aiSummary || rawContent).slice(0, 400) || item.title;
        const content = rawContent || item.title;

        const article = new News({
            title: item.title.slice(0, 200),
            summary,
            content,
            sourceUrl: item.link || '',
            universityName: source.universityName,
            country: source.country,
            author: source.universityName,
            status: 'published',
            publishDate: item.isoDate ? new Date(item.isoDate) : new Date(),
            category,
            aiSummary: aiSummary || '',
            isAutoFetched: true,
            tags: [],
        });

        await article.save();
        saved++;
    }

    await NewsSource.findByIdAndUpdate(source._id, {
        lastFetched: new Date(),
        $inc: { totalFetched: saved },
        $unset: { lastError: '' },
    });

    return saved;
}

export async function runAggregator(): Promise<{ total: number; errors: string[] }> {
    const sources = await NewsSource.find({ active: true });
    let total = 0;
    const errors: string[] = [];

    for (const source of sources) {
        try {
            const count = await fetchAndSaveSource(source);
            total += count;
            console.log(`[RSS] ${source.universityName}: +${count} new articles`);
        } catch (err: any) {
            const msg = `${source.universityName}: ${err.message}`;
            errors.push(msg);
            console.error(`[RSS] Error — ${msg}`);
            await NewsSource.findByIdAndUpdate(source._id, { lastError: err.message }).catch(() => {});
        }
    }

    console.log(`[RSS] Aggregation done: ${total} total new articles, ${errors.length} source errors`);
    return { total, errors };
}
