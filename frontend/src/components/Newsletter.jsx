import { useState } from 'react';
import { api } from '../services/api.js';
import { Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const { language } = useLanguage();

  async function submit(event) {
    event.preventDefault();
    await api.post('/subscribers/subscribe', { email, language });
    setDone(true);
    setEmail('');
  }

  return (
    <section className="bg-brand-red py-8 text-white">
      <div className="container-page grid gap-4 md:grid-cols-[1fr_420px] md:items-center">
        <div>
          <h2 className="text-2xl font-black">Speed News 24 Newsletter</h2>
          <p className="text-sm text-red-50">Daily top stories, breaking updates, and AI summaries delivered to your inbox.</p>
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input className="input text-zinc-900" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          <button className="btn-ghost border-white bg-white text-brand-red" aria-label="Subscribe"><Send size={18} /></button>
        </form>
        {done && <p className="text-sm font-bold md:col-start-2">Subscribed successfully.</p>}
      </div>
    </section>
  );
}
