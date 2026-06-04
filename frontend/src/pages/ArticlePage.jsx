import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Facebook, Linkedin, MessageCircle, Send, Twitter } from 'lucide-react';
import ArticleCard from '../components/ArticleCard.jsx';
import AdSlot from '../components/AdSlot.jsx';
import { api, articleApi } from '../services/api.js';
import { formatDate, shareUrls } from '../utils/format.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useState } from 'react';

export default function ArticlePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const { data, refetch } = useQuery({ queryKey: ['article', slug], queryFn: () => articleApi.get(slug) });
  const article = data?.article;
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', article?._id],
    enabled: Boolean(article?._id),
    queryFn: () => api.get('/comments', { params: { article: article._id } }).then((r) => r.data)
  });
  if (!article) return <main className="container-page py-12">Loading article...</main>;
  const share = shareUrls(article);

  async function submitComment(event) {
    event.preventDefault();
    await api.post('/comments', { article: article._id, body: comment });
    setComment('');
    refetch();
  }

  return (
    <main className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
      <Helmet>
        <title>{article.seo?.title || article.title}</title>
        <meta name="description" content={article.seo?.description || article.excerpt} />
        <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL || window.location.origin}/article/${article.slug}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:image" content={article.image?.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: article.title, image: [article.image?.url], datePublished: article.publishedAt, author: { '@type': 'Person', name: article.author?.name || 'Speed News 24' } })}</script>
      </Helmet>
      <article className="news-card overflow-hidden">
        <img className="aspect-video w-full object-cover" src={article.image?.url} alt={article.image?.alt || article.title} />
        <div className="p-5 md:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm font-bold text-brand-red">
            <span>{article.category?.name}</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>{article.readingTime} min read</span>
          </div>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">{article.aiHeadline || article.title}</h1>
          {article.aiSummary && <aside className="my-6 rounded-md border-l-4 border-brand-red bg-red-50 p-4 text-sm font-semibold text-zinc-900">{article.aiSummary}</aside>}
          <div className="prose prose-zinc max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(share).map(([name, url]) => (
              <a key={name} className="btn-ghost capitalize" href={url} target="_blank" rel="noreferrer">
                {name === 'facebook' && <Facebook size={16} />}{name === 'x' && <Twitter size={16} />}{name === 'whatsapp' && <MessageCircle size={16} />}{name === 'telegram' && <Send size={16} />}{name === 'linkedin' && <Linkedin size={16} />}{name}
              </a>
            ))}
          </div>
        </div>
      </article>
      <aside className="grid h-fit gap-4">
        <AdSlot placement="sidebar" />
        <div className="news-card p-4">
          <h2 className="mb-3 text-lg font-black">Related Articles</h2>
          <div className="grid gap-3">{data.related?.map((item) => <ArticleCard key={item._id} article={item} />)}</div>
        </div>
      </aside>
      <section className="news-card p-5 lg:col-span-2">
        <h2 className="mb-4 text-xl font-black">Comments</h2>
        {user && <form onSubmit={submitComment} className="mb-4 grid gap-2"><textarea className="input min-h-24" value={comment} onChange={(e) => setComment(e.target.value)} required /><button className="btn-primary w-fit">Post Comment</button></form>}
        <div className="grid gap-3">{comments.map((item) => <div key={item._id} className="rounded-md bg-zinc-100 p-3 dark:bg-zinc-800"><strong>{item.user?.name}</strong><p>{item.body}</p></div>)}</div>
      </section>
    </main>
  );
}
