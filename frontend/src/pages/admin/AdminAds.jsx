import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api.js';

export default function AdminAds() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['ads'], queryFn: adminApi.ads });
  const create = useMutation({ mutationFn: adminApi.createAd, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ads'] }) });
  function submit(event) {
    event.preventDefault();
    create.mutate(Object.fromEntries(new FormData(event.currentTarget)));
    event.currentTarget.reset();
  }
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-black">Advertisements</h1>
      <form onSubmit={submit} className="news-card grid gap-3 p-4">
        <input className="input" name="title" placeholder="Ad title" required />
        <select className="input" name="placement" required>
          <option value="header">Header</option>
          <option value="sidebar">Sidebar</option>
          <option value="between_articles">Between Articles</option>
          <option value="footer">Footer</option>
        </select>
        <input className="input" name="sponsorName" placeholder="Sponsor" />
        <input className="input" name="imageUrl" placeholder="Image URL" />
        <input className="input" name="targetUrl" placeholder="Target URL" />
        <textarea className="input" name="code" placeholder="AdSense code" />
        <button className="btn-primary w-fit">Save Ad</button>
      </form>
      <div className="grid gap-3 md:grid-cols-3">{data.map((ad) => <div className="news-card p-4" key={ad._id}><strong>{ad.title}</strong><p className="text-sm text-zinc-500">{ad.placement}</p></div>)}</div>
    </section>
  );
}
