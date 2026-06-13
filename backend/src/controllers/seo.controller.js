import Article from '../models/Article.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const sitemap = asyncHandler(async (_req, res) => {
  const articles = await Article.find({ status: 'published' }).select('slug updatedAt').sort({ updatedAt: -1 }).limit(50000);
  const base = env.CLIENT_URL.replace(/\/$/, '');
  const staticPages = ['', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'].map((path) => `<url><loc>${base}${path}</loc></url>`).join('');
  const urls = articles.map((a) => `<url><loc>${base}/article/${a.slug}</loc><lastmod>${a.updatedAt.toISOString()}</lastmod></url>`).join('');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticPages}${urls}</urlset>`);
});

export const robots = (_req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${env.API_BASE_URL}/seo/sitemap.xml\n`);
};
