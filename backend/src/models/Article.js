import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: 'text' },
    aiHeadline: String,
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    content: { type: String, required: true },
    aiSummary: String,
    language: { type: String, enum: ['en', 'hi'], default: 'en', index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    source: {
      name: String,
      url: String,
      externalId: { type: String, index: true }
    },
    image: {
      url: String,
      alt: String,
      provider: String
    },
    videoUrl: String,
    tags: [{ type: String, index: true }],
    seo: {
      title: String,
      description: String,
      keywords: [String],
      canonicalUrl: String
    },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published', index: true },
    isBreaking: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 1 },
    publishedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model('Article', articleSchema);
