import { body, query } from 'express-validator';
import Article from '../models/Article.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { makeSlug } from '../utils/slug.js';
import { enrichArticleWithAI } from '../services/aiService.js';
import { resolveArticleImage } from '../services/imageService.js';

export const articleRules = [
  body('title').trim().isLength({ min: 4 }),
  body('content').trim().isLength({ min: 20 }),
  body('category').isMongoId()
];

export const listArticles = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const filter = { status: 'published' };
    if (req.query.category) {
      const categoryQuery = /^[a-f\d]{24}$/i.test(req.query.category)
        ? { $or: [{ slug: req.query.category }, { _id: req.query.category }] }
        : { slug: req.query.category };
      const category = await Category.findOne(categoryQuery);
      if (category) filter.category = category._id;
    }
    if (req.query.language) filter.language = req.query.language;
    if (req.query.breaking) filter.isBreaking = true;
    if (req.query.featured) filter.isFeatured = true;
    if (req.query.search) filter.$text = { $search: req.query.search };
    const [items, total] = await Promise.all([
      Article.find(filter).populate('category author', 'name slug').sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit),
      Article.countDocuments(filter)
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  })
];

export const getArticle = asyncHandler(async (req, res) => {
  const article = await Article.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('category author', 'name slug');
  if (!article) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
  const related = await Article.find({ _id: { $ne: article._id }, category: article.category._id, status: 'published' }).limit(4).sort({ publishedAt: -1 });
  res.json({ article, related });
});

export const createArticle = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) throw Object.assign(new Error('Category not found'), { statusCode: 404 });
  const ai = req.body.skipAi ? {} : await enrichArticleWithAI(req.body);
  const image = req.body.imageUrl ? { url: req.body.imageUrl, alt: req.body.title, provider: 'manual' } : req.body.image;
  const article = new Article({
    ...req.body,
    image,
    author: req.user._id,
    slug: req.body.slug || `${makeSlug(ai.headline || req.body.title)}-${Date.now().toString(36)}`,
    aiHeadline: ai.headline || req.body.title,
    aiSummary: ai.summary || req.body.aiSummary,
    tags: req.body.tags?.length ? req.body.tags : ai.tags || [],
    seo: {
      title: req.body.seo?.title || ai.seoTitle || req.body.title,
      description: req.body.seo?.description || ai.seoDescription || req.body.excerpt,
      keywords: req.body.seo?.keywords || ai.seoKeywords || []
    }
  });
  article.readingTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 220));
  article.image = await resolveArticleImage({ ...article.toObject(), categoryName: category.name });
  await article.save();
  res.status(201).json(article);
});

export const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!article) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
  res.json(article);
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true });
  if (!article) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
  res.json({ message: 'Article archived' });
});
