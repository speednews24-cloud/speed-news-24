import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    try {
      await register(Object.fromEntries(new FormData(event.currentTarget)));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-8">
      <form onSubmit={submit} className="news-card grid w-full max-w-md gap-4 p-6">
        <h1 className="text-2xl font-black">Create Account</h1>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <input className="input" name="name" placeholder="Name" required />
        <input className="input" name="email" type="email" placeholder="Email" required />
        <input className="input" name="password" type="password" placeholder="Password" minLength="8" required />
        <button className="btn-primary">Register</button>
      </form>
    </main>
  );
}
