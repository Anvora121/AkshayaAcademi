const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama3-8b-8192';

const NEWS_CATEGORIES = [
    'Admission Updates',
    'Scholarships',
    'University Rankings',
    'Placements',
    'Visa & Immigration',
    'Campus Updates',
    'General Education',
] as const;

async function callGroq(prompt: string, maxTokens = 200): Promise<string> {
    const key = process.env.GROQ_API_KEY;
    if (!key) {
        console.warn('[AI] GROQ_API_KEY not set — skipping AI processing');
        return '';
    }

    try {
        const res = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTokens,
                temperature: 0.3,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('[AI] Groq API error:', res.status, err.slice(0, 200));
            return '';
        }

        const data = (await res.json()) as any;
        return data.choices?.[0]?.message?.content?.trim() ?? '';
    } catch (err) {
        console.error('[AI] Groq request failed:', err);
        return '';
    }
}

export async function generateAiSummary(title: string, content: string): Promise<string> {
    const text = `${title}\n${content}`.slice(0, 2000);
    const prompt = `You are summarizing university news for international students applying abroad. Write a factual 2-3 sentence summary (max 80 words). Include: key outcome, specific details (dates, amounts, eligibility), and why it matters for students. No filler phrases.\n\nArticle:\n${text}\n\nSummary:`;
    const result = await callGroq(prompt, 150);
    return result || content.slice(0, 250);
}

export async function categorizeArticle(title: string, content: string): Promise<string> {
    const text = `${title}: ${content}`.slice(0, 500);
    const prompt = `Classify this university news into exactly one category from the list below. Respond with only the category name, nothing else.\n\nCategories:\n${NEWS_CATEGORIES.join('\n')}\n\nNews: "${text}"\n\nCategory:`;
    const result = await callGroq(prompt, 25);
    const clean = result.trim();
    return (NEWS_CATEGORIES as readonly string[]).includes(clean) ? clean : 'General Education';
}
