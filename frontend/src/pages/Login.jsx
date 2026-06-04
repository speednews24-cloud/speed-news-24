import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    try {
      await login(Object.fromEntries(new FormData(event.currentTarget)));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-8">
      <form onSubmit={submit} className="news-card grid w-full max-w-md gap-4 p-6">
        <h1 className="text-2xl font-black">Admin / User Login</h1>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <input className="input" name="email" type="email" placeholder="Email" required />
        <input className="input" name="password" type="password" placeholder="Password" required />
        <button className="btn-primary">Login</button>
        <Link to="/register" className="text-sm font-bold text-brand-red">Create account</Link>
      </form>
    </main>
  );
}
