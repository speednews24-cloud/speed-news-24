import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import articleRoutes from './routes/article.routes.js';
import categoryRoutes from './routes/category.routes.js';
import commentRoutes from './routes/comment.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';
import adminRoutes from './routes/admin.routes.js';
import seoRoutes from './routes/seo.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/error.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250 }));
if (env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.get('/health', (_req, res) => res.json({ ok: true, name: 'Speed News 24 API' }));
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
