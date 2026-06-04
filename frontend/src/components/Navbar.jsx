import { Moon, Search, Sun } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { dark, setDark } = useTheme();
  const { user, logout } = useAuth();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });

  function submit(event) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get('q');
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-brand-black/95">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-black tracking-wide">
          <span className="rounded bg-brand-red px-2 py-1 text-white">Speed</span>
          <span>News 24</span>
        </Link>
        <nav className="hidden flex-1 items-center gap-3 overflow-x-auto text-sm font-bold lg:flex">
          <NavLink to="/" className="hover:text-brand-red">Home</NavLink>
          {categories.slice(0, 9).map((cat) => (
            <NavLink key={cat._id} to={`/category/${cat.slug}`} className="whitespace-nowrap hover:text-brand-red">{cat.name}</NavLink>
          ))}
        </nav>
        <form onSubmit={submit} className="hidden min-w-56 items-center gap-2 rounded-md border border-zinc-300 px-2 dark:border-zinc-700 md:flex">
          <Search size={18} />
          <input name="q" aria-label={t.search} placeholder={t.search} className="w-full bg-transparent py-2 text-sm outline-none" />
        </form>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-md border border-zinc-300 bg-transparent px-2 py-2 text-sm dark:border-zinc-700">
          <option value="en">EN</option>
          <option value="hi">HI</option>
        </select>
        <button aria-label="Toggle dark mode" className="btn-ghost px-2" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        {user ? <button className="btn-ghost" onClick={logout}>Logout</button> : <Link className="btn-primary" to="/login">Login</Link>}
      </div>
    </header>
  );
}
