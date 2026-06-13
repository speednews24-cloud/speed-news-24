import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import ArticleCard from '../components/ArticleCard.jsx';
import NewsTicker from '../components/NewsTicker.jsx';
import AdSlot from '../components/AdSlot.jsx';
import Newsletter from '../components/Newsletter.jsx';
import VideoSection from '../components/VideoSection.jsx';
import { articleApi, categoryApi } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Home() {
  const { language, t } = useLanguage();
  const { data: latest } = useQuery({ queryKey: ['articles', language], queryFn: () => articleApi.list({ language, limit: 12 }) });
  const { data: breaking } = useQuery({ queryKey: ['breaking', language], queryFn: () => articleApi.list({ language, breaking: true, limit: 6 }) });
  const { data: fallbackLatest } = useQuery({
    queryKey: ['articles-fallback', language],
    enabled: language === 'hi' && latest?.items?.length === 0,
    queryFn: () => articleApi.list({ limit: 12 })
  });
  const { data: fallbackBreaking } = useQuery({
    queryKey: ['breaking-fallback', language],
    enabled: language === 'hi' && breaking?.items?.length === 0,
    queryFn: () => articleApi.list({ breaking: true, limit: 6 })
  });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const articles = latest?.items?.length ? latest.items : fallbackLatest?.items || [];
  const tickerArticles = breaking?.items?.length ? breaking.items : fallbackBreaking?.items || articles.slice(0, 6);
  const hero = articles[0];

  return (
    <main>
      <Helmet>
        <title>Speed News 24 | Fast Hindi and English News</title>
        <meta name="description" content="Speed News 24 delivers AI-powered breaking news, latest updates, and smart summaries in Hindi and English." />
        <meta property="og:title" content="Speed News 24" />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsMediaOrganization', name: 'Speed News 24' })}</script>
      </Helmet>
      <NewsTicker articles={tickerArticles} />
      <section className="bg-white py-6 dark:bg-zinc-950">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_320px]">
          {hero && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <ArticleCard article={hero} large />
            </motion.div>
          )}
          <div className="grid gap-4">
            <AdSlot placement="header" />
            <div className="news-card p-4">
              <h2 className="mb-3 text-lg font-black">{t.trending}</h2>
              <div className="grid gap-3">
                {articles.slice(1, 6).map((article) => <ArticleCard key={article._id} article={article} />)}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-black">{t.latest}</h2>
          <span className="text-sm font-bold text-brand-red">{language === 'hi' ? 'Hindi + Latest' : 'AI Summary Ready'}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(1).map((article, index) => (
            index === 4 ? <div key="ad-between" className="md:col-span-2 lg:col-span-3"><AdSlot placement="between_articles" /></div> : <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </section>
      <section className="bg-white py-8 dark:bg-zinc-950">
        <div className="container-page">
          <h2 className="mb-4 text-2xl font-black">Categories</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((cat) => (
              <a key={cat._id} href={`/category/${cat.slug}`} className="news-card p-5 hover:border-brand-red">
                <h3 className="text-xl font-black">{cat.name}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{cat.description || `Latest updates from ${cat.name}.`}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <VideoSection videos={articles.map((a) => a.videoUrl).filter(Boolean)} />
      <Newsletter />
    </main>
  );
}
