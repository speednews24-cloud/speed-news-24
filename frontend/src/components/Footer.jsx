import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-8 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-page grid gap-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2 className="text-xl font-black"><span className="text-brand-red">Speed</span> News 24</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">AI-assisted news aggregation and editorial publishing for Hindi and English readers.</p>
        </div>
        <div className="grid gap-2">
          <Link to="/category/breaking-news">Breaking News</Link>
          <Link to="/category/india">India</Link>
          <Link to="/category/world">World</Link>
        </div>
        <div className="grid gap-2">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/disclaimer">Disclaimer</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
