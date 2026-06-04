import Advertisement from '../models/Advertisement.js';
import Article from '../models/Article.js';
import Comment from '../models/Comment.js';
import Subscriber from '../models/Subscriber.js';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { refreshExistingArticles, runNewsAggregation } from '../services/newsService.js';

export const analytics = asyncHandler(async (_req, res) => {
  const [articles, users, subscribers, comments, viewsAgg] = await Promise.all([
    Article.countDocuments(),
    User.countDocuments(),
    Subscriber.countDocuments({ isActive: true }),
    Comment.countDocuments(),
    Article.aggregate([{ $group: { _id: null, views: { $sum: '$views' } } }])
  ]);
  const views = viewsAgg[0]?.views || 0;
  const activeAds = await Advertisement.countDocuments({ isActive: true });
  const estimatedRevenue = Math.round((views / 1000) * env.ESTIMATED_AD_RPM_INR * Math.max(1, activeAds));
  const recent = await Article.find().sort({ publishedAt: -1 }).limit(8).select('title views publishedAt');
  res.json({ articles, users, subscribers, comments, views, revenue: estimatedRevenue, revenueCurrency: 'INR', rpm: env.ESTIMATED_AD_RPM_INR, activeAds, recent });
});

export const triggerAggregation = asyncHandler(async (_req, res) => {
  const items = await runNewsAggregation();
  res.json({ imported: items.filter(Boolean).length });
});

export const refreshArticles = asyncHandler(async (_req, res) => {
  const updated = await refreshExistingArticles({ limit: 120 });
  res.json({ updated });
});

export const listAds = asyncHandler(async (_req, res) => res.json(await Advertisement.find().sort({ createdAt: -1 })));

export const createAd = asyncHandler(async (req, res) => res.status(201).json(await Advertisement.create(req.body)));

export const updateAd = asyncHandler(async (req, res) => {
  const ad = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!ad) throw Object.assign(new Error('Advertisement not found'), { statusCode: 404 });
  res.json(ad);
});
