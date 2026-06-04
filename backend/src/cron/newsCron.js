import cron from 'node-cron';
import { runNewsAggregation } from '../services/newsService.js';

let scheduled = false;

export function startNewsCron() {
  if (scheduled) return;
  scheduled = true;
  cron.schedule('*/15 * * * *', async () => {
    console.log('Running automated news aggregation');
    await runNewsAggregation().catch((error) => console.error('News aggregation failed', error.message));
  });
}
