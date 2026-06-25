import cron from 'node-cron';
import { runAggregator } from '../services/rssAggregator';

export function startCronJobs(): void {
    // RSS aggregation: every 6 hours at minute 0
    cron.schedule('0 */6 * * *', async () => {
        console.log('[CRON] RSS aggregation starting...');
        try {
            const { total, errors } = await runAggregator();
            if (errors.length) {
                console.warn(`[CRON] ${errors.length} source error(s):`, errors);
            }
            console.log(`[CRON] RSS aggregation complete — ${total} new articles`);
        } catch (err) {
            console.error('[CRON] RSS aggregation failed:', err);
        }
    });

    console.log('[CRON] Scheduled: RSS aggregation every 6 hours');
}
