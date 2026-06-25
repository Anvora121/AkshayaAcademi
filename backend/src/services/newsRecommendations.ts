import { News } from '../models/News';
import { StudentProfile } from '../models/StudentProfile';

// Domain → keyword mapping for content matching
const DOMAIN_KEYWORDS: Record<string, string[]> = {
    'Computer Science': ['computer', 'software', 'ai', 'artificial intelligence', 'machine learning', 'data science', 'programming', 'algorithm', 'cybersecurity'],
    'Engineering':      ['engineering', 'mechanical', 'electrical', 'civil', 'chemical', 'robotics', 'aerospace'],
    'Business':         ['business', 'mba', 'management', 'finance', 'marketing', 'entrepreneurship', 'economics', 'commerce'],
    'Medicine':         ['medicine', 'medical', 'health', 'clinical', 'pharma', 'biomedical', 'nursing', 'dentistry'],
    'Data Science':     ['data science', 'data analytics', 'statistics', 'machine learning', 'ai', 'deep learning', 'big data', 'analytics'],
    'Design':           ['design', 'ux', 'ui', 'architecture', 'art', 'creative', 'fashion', 'industrial design'],
    'Law':              ['law', 'legal', 'llm', 'jurisprudence', 'bar'],
    'Social Sciences':  ['psychology', 'sociology', 'political science', 'anthropology', 'social work'],
    'Physics':          ['physics', 'quantum', 'astronomy', 'astrophysics'],
    'Biology':          ['biology', 'bioinformatics', 'genetics', 'ecology', 'biochemistry'],
};

function getKeywords(domain?: string): string[] {
    if (!domain) return [];
    const lower = domain.toLowerCase();
    for (const [key, words] of Object.entries(DOMAIN_KEYWORDS)) {
        if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
            return words;
        }
    }
    return [lower];
}

export async function getRecommendedNews(userId: string | null, limit = 6): Promise<any[]> {
    const fallback = () =>
        News.find({ status: 'published' })
            .sort({ featured: -1, publishDate: -1 })
            .limit(limit)
            .select('-content')
            .lean();

    if (!userId) return fallback();

    const profile = await StudentProfile.findOne({ userId }).lean();
    if (!profile) return fallback();

    const keywords = getKeywords(profile.domain);
    const countries = (profile.preferredCountries || []).map((c) => c.toLowerCase());
    const universities = (profile.preferredUniversities || []).map((u) => u.toLowerCase());
    const specialization = (profile.specialization || '').toLowerCase();

    const articles = await News.find({ status: 'published' })
        .sort({ publishDate: -1, createdAt: -1 })
        .limit(100)
        .select('-content')
        .lean();

    const scored = articles.map((article) => {
        let score = 0;
        const searchText = [
            article.title || '',
            article.summary || '',
            (article.tags || []).join(' '),
        ].join(' ').toLowerCase();

        // Country match: 30 pts
        if (article.country && countries.includes(article.country.toLowerCase())) score += 30;

        // University match: 30 pts
        if (article.universityName) {
            const uniLower = article.universityName.toLowerCase();
            if (universities.some((u) => uniLower.includes(u) || u.includes(uniLower))) {
                score += 30;
            }
        }

        // Domain keyword match: up to 40 pts
        const matchedKeywords = keywords.filter((kw) => searchText.includes(kw));
        if (matchedKeywords.length > 0) score += Math.min(40, matchedKeywords.length * 14);

        // Specialization direct match: bonus 10 pts
        if (specialization && searchText.includes(specialization)) score += 10;

        // Everyone wants scholarships: +8 bonus
        if (article.category === 'Scholarships') score += 8;

        // Visa updates matter to international students: +5
        if (article.category === 'Visa & Immigration') score += 5;

        return { article, score };
    });

    const matched = scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.article);

    // If fewer than 3 personalized results, fill from latest
    if (matched.length < 3) return fallback();

    return matched;
}
