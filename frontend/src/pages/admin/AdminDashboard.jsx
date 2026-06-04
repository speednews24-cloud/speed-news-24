import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminApi } from '../../services/api.js';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-analytics'], queryFn: adminApi.analytics });
  const aggregation = useMutation({ mutationFn: adminApi.aggregate, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-analytics'] }) });
  const refresh = useMutation({ mutationFn: adminApi.refreshArticles, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-analytics'] }) });
  const stats = [
    ['Articles', data?.articles || 0],
    ['Views', data?.views || 0],
    ['Users', data?.users || 0],
    ['Subscribers', data?.subscribers || 0],
    ['Revenue', `₹${data?.revenue || 0}`]
  ];

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">Dashboard</h1>
        <button className="btn-primary" onClick={() => aggregation.mutate()} disabled={aggregation.isPending}>
          {aggregation.isPending ? 'Importing...' : 'Run News Aggregation'}
        </button>
        <button className="btn-ghost" onClick={() => refresh.mutate()} disabled={refresh.isPending}>
          {refresh.isPending ? 'Refreshing...' : 'Refresh Images & Content'}
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {stats.map(([label, value]) => <div key={label} className="news-card p-4"><p className="text-sm font-bold text-zinc-500">{label}</p><strong className="text-2xl">{value}</strong></div>)}
      </div>
      <div className="mt-6 news-card p-4">
        <h2 className="mb-4 text-xl font-black">Recent Article Views</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.recent || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#e50914" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
