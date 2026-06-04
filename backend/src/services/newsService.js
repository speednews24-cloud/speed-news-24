import axios from 'axios';
import { extract } from '@extractus/feed-extractor';
import Article from '../models/Article.js';
import Category from '../models/Category.js';
import { env } from '../config/env.js';
import { makeSlug } from '../utils/slug.js';
import { enrichArticleWithAI } from './aiService.js';
import { resolveArticleImage } from './imageService.js';

const rssFeeds = [
  { url: 'https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi', category: 'Breaking News', language: 'hi' },
  { url: 'https://www.aajtak.in/rssfeeds/?id=home', category: 'India', language: 'hi' },
  { url: 'https://zeenews.india.com/hindi/rss/india-national-news.xml', category: 'India', language: 'hi' },
  { url: 'https://www.abplive.com/home/feed', category: 'India', language: 'hi' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', language: 'en' },
  { url: 'https://www.thehindu.com/news/national/feeder/default.rss', category: 'India', language: 'en' },
  { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'India', language: 'en' },
  { url: 'https://www.ndtv.com/rss/india', category: 'India', language: 'en' }
];

const defaultCategories = ['Breaking News', 'India', 'World', 'Politics', 'Technology', 'Sports', 'Entertainment', 'Education', 'Business'];

export async function ensureDefaultCategories() {
  await Promise.all(defaultCategories.map((name, order) =>
    Category.updateOne({ slug: makeSlug(name) }, { $setOnInsert: { name, slug: makeSlug(name), order } }, { upsert: true })
  ));
}

async function upsertRawArticle(raw, fallbackCategory = 'Breaking News') {
  if (!raw.url || !raw.title) return null;
  const existing = await Article.findOne({ 'source.url': raw.url });
  if (existing) return existing;
  const category = await Category.findOne({ slug: makeSlug(raw.category || fallbackCategory) }) || await Category.findOne();
  const body = raw.content || raw.description || raw.title;
  const ai = await enrichArticleWithAI({ title: raw.title, content: body });
  const article = new Article({
    title: raw.title,
    aiHeadline: ai.headline || raw.title,
    slug: `${makeSlug(ai.headline || raw.title)}-${Date.now().toString(36)}`,
    excerpt: raw.description || ai.summary,
    content: body,
    aiSummary: ai.summary,
    language: raw.language || (/[\u0900-\u097F]/.test(`${raw.title} ${body}`) ? 'hi' : 'en'),
    category: category._id,
    source: { name: raw.source || 'RSS', url: raw.url, externalId: raw.url },
    tags: ai.tags?.length ? ai.tags : [category.name, raw.language === 'hi' ? 'Hindi News' : 'News'],
    seo: {
      title: ai.seoTitle || raw.title,
      description: ai.seoDescription || raw.description || ai.summary,
      keywords: ai.seoKeywords || ai.tags || []
    },
    publishedAt: raw.publishedAt || new Date(),
    status: 'published'
  });
  article.readingTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 220));
  article.image = await resolveArticleImage({ ...article.toObject(), image: raw.image ? { url: raw.image, alt: raw.title, provider: 'source' } : undefined });
  return article.save();
}

export async function fetchNewsAPI() {
  if (!env.NEWS_API_KEY) return [];
  const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
    params: { country: 'in', pageSize: 20, apiKey: env.NEWS_API_KEY },
    timeout: 15000
  });
  return Promise.all((data.articles || []).map((item) => upsertRawArticle({
    title: item.title,
    description: item.description,
    content: item.content,
    url: item.url,
    image: item.urlToImage,
    source: item.source?.name,
    publishedAt: item.publishedAt
  }, 'India')));
}

export async function fetchGNews() {
  if (!env.GNEWS_API_KEY) return [];
  const requests = ['en', 'hi'].map((lang) =>
    axios.get('https://gnews.io/api/v4/top-headlines', {
      params: { country: 'in', lang, max: 20, token: env.GNEWS_API_KEY },
      timeout: 15000
    })
  );
  const responses = await Promise.allSettled(requests);
  return Promise.all(responses.flatMap((response) => response.status === 'fulfilled' ? response.value.data.articles || [] : []).map((item) => upsertRawArticle({
    title: item.title,
    description: item.description,
    content: item.content,
    url: item.url,
    image: item.image,
    source: item.source?.name,
    publishedAt: item.publishedAt
  }, 'Breaking News')));
}

function getRssImage(item) {
  return item.image?.url || item.image || item.enclosure?.url || item.media?.thumbnail?.url || item.media?.content?.url || item['media:content']?.url || item['media:thumbnail']?.url;
}

export async function fetchRSSFeeds() {
  const results = [];
  for (const feed of rssFeeds) {
    const parsed = await extract(feed.url).catch(() => null);
    for (const item of parsed?.entries || []) {
      results.push(await upsertRawArticle({
        title: item.title,
        description: item.description,
        content: item.content || item.description || item.title,
        url: item.link,
        image: getRssImage(item),
        source: parsed.title,
        publishedAt: item.published,
        language: feed.language,
        category: feed.category
      }, feed.category));
    }
  }
  return results;
}

export async function runNewsAggregation() {
  await ensureDefaultCategories();
  const settled = await Promise.allSettled([fetchNewsAPI(), fetchGNews(), fetchRSSFeeds()]);
  return settled.flatMap((item) => item.status === 'fulfilled' ? item.value : []);
}
