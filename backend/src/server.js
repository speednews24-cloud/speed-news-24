import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { startNewsCron } from './cron/newsCron.js';

await connectDB();

const server = app.listen(env.PORT, () => {
  console.log(`Speed News 24 API running on port ${env.PORT}`);
  startNewsCron();
});

process.on('unhandledRejection', (err) => {
  console.error(err);
  server.close(() => process.exit(1));
});
