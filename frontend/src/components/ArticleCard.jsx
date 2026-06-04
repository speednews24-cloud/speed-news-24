import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { formatDate } from '../utils/format.js';

export default function ArticleCard({ article, large = false }) {
  return (
    <article className={`news-card group ${large ? 'md:col-span-2 md:grid md:grid-cols-2' : ''}`}>
      <Link to={`/article/${article.slug}`} className="block aspect-video overflow-hidden bg-zinc-200">
        <img src={article.image?.url} alt={article.image?.alt || article.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-brand-red">
          <span>{article.category?.name || 'News'}</span>
          {article.isBreaking && <span className="rounded bg-brand-red px-2 py-0.5 text-white">Breaking</span>}
        </div>
        <Link to={`/article/${article.slug}`} className={`${large ? 'text-2xl' : 'text-lg'} font-black leading-tight hover:text-brand-red`}>
          {article.aiHeadline || article.title}
        </Link>
        <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">{article.excerpt || article.aiSummary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><Clock size={14} />{article.readingTime || 1} min</span>
          <span className="inline-flex items-center gap-1"><Eye size={14} />{article.views || 0}</span>
        </div>
      </div>
    </article>
  );
}
