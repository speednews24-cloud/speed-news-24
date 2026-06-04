import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../services/api.js';

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const create = useMutation({ mutationFn: categoryApi.create, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }) });
  function submit(event) {
    event.preventDefault();
    create.mutate(Object.fromEntries(new FormData(event.currentTarget)));
    event.currentTarget.reset();
  }
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-black">Manage Categories</h1>
      <form onSubmit={submit} className="news-card grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto]">
        <input className="input" name="name" placeholder="Category name" required />
        <input className="input" name="description" placeholder="Description" />
        <button className="btn-primary">Create</button>
      </form>
      <div className="grid gap-3 md:grid-cols-3">{data.map((cat) => <div className="news-card p-4" key={cat._id}><strong>{cat.name}</strong><p className="text-sm text-zinc-500">{cat.slug}</p></div>)}</div>
    </section>
  );
}
