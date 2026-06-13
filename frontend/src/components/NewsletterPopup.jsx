import { useEffect, useState } from 'react';
import { Send, X } from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const storageKey = 'sn24_newsletter_popup_done';

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    if (localStorage.getItem(storageKey)) return undefined;
    const timer = setTimeout(() => setOpen(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    localStorage.setItem(storageKey, 'closed');
    setOpen(false);
  }

  async function submit(event) {
    event.preventDefault();
    await api.post('/subscribers/subscribe', { email, language });
    localStorage.setItem(storageKey, 'subscribed');
    setMessage('Subscribed successfully.');
    setTimeout(() => setOpen(false), 1200);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4">
      <div className="news-card w-full max-w-md p-5 shadow-news">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">Speed News 24 Newsletter</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Breaking news and top updates directly in your inbox.</p>
          </div>
          <button className="btn-ghost px-2" onClick={close} aria-label="Close newsletter popup">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="yourgmail@gmail.com"
          />
          <button className="btn-primary">
            <Send size={18} />
            Subscribe
          </button>
        </form>
        {message && <p className="mt-3 text-sm font-bold text-brand-red">{message}</p>}
      </div>
    </div>
  );
}
