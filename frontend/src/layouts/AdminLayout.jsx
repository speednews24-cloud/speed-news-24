import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Tags, BadgeIndianRupee } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AdminLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!['admin', 'editor'].includes(user.role)) return <Navigate to="/" replace />;
  const links = [
    ['Dashboard', '/admin', LayoutDashboard],
    ['News', '/admin/articles', Newspaper],
    ['Categories', '/admin/categories', Tags],
    ['Ads', '/admin/ads', BadgeIndianRupee]
  ];
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-brand-black">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:block">
        <h1 className="mb-8 text-xl font-black"><span className="text-brand-red">Speed</span> Admin</h1>
        <nav className="grid gap-2">
          {links.map(([label, path, Icon]) => <NavLink key={path} end={path === '/admin'} to={path} className="btn-ghost justify-start"><Icon size={18} />{label}</NavLink>)}
        </nav>
      </aside>
      <main className="p-4 md:ml-64 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
