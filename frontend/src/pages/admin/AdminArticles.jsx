import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { articleApi, categoryApi } from '../../services/api.js';

export default function AdminArticles() {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const { data } = useQuery({ queryKey: ['admin-articles'], queryFn: () => articleApi.list({ limit: 20 }) });
  const create = useMutation({ mutationFn: articleApi.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-articles'] }) });

  function submit(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    payload.isBreaking = Boolean(payload.isBreaking);
    payload.isFeatured = Boolean(payload.isFeatured);
    create.mutate(payload);
    event.currentTarget.reset();
  }

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-black">Manage News</h1>
      <form onSubmit={submit} className="news-card grid gap-3 p-4">
        <input className="input" name="title" placeholder="Article title" required />
        <textarea className="input min-h-36" name="content" placeholder="Article content" required />
        <select className="input" name="category" required>{categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}</select>
        <input className="input" name="excerpt" placeholder="Excerpt" />
        <input className="input" name="videoUrl" placeholder="YouTube embed URL" />
        <div className="flex gap-4 text-sm font-bold"><label><input name="isBreaking" type="checkbox" /> Breaking</label><label><input name="isFeatured" type="checkbox" /> Featured</label></div>
        <button className="btn-primary w-fit" disabled={create.isPending}>Publish</button>
      </form>
      <div className="news-card overflow-hidden">
        {(data?.items || []).map((article) => <div key={article._id} className="border-b border-zinc-200 p-4 dark:border-zinc-800"><strong>{article.title}</strong><p className="text-sm text-zinc-500">{article.category?.name} • {article.views} views</p></div>)}
      </div>
    </section>
  );
}
