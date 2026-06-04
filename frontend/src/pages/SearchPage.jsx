import { useSearchParams, useParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard.jsx';
import { useInfiniteArticles } from '../hooks/useInfiniteArticles.js';

export default function SearchPage() {
  const [params] = useSearchParams();
  const { slug } = useParams();
  const query = params.get('q') || '';
  const articles = useInfiniteArticles({ search: query, category: slug });
  const items = articles.data?.pages.flatMap((page) => page.items) || [];
  return (
    <main className="container-page py-8">
      <h1 className="mb-6 text-3xl font-black">{query ? `Search: ${query}` : slug ? `Category: ${slug}` : 'News Search'}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((article) => <ArticleCard key={article._id} article={article} />)}</div>
      {articles.hasNextPage && <button className="btn-primary mx-auto mt-8 flex" onClick={() => articles.fetchNextPage()}>Load More</button>}
    </main>
  );
}
