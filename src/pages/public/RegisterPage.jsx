import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToaster } from '../../components/common/Toaster';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toaster = useToaster();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) return toaster.show('Password must be at least 8 characters', 'error');
    setLoading(true);
    try {
      await register(form);
      toaster.show('Account created. Please sign in.');
      navigate('/login');
    } catch (error) {
      toaster.show(error.response?.data?.message || 'Unable to register', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center px-4 py-10">
      <form onSubmit={submit} className="card w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-bold">Create candidate account</h1>
        <p className="mt-1 text-sm text-slate-500">Registration creates a CANDIDATE account.</p>
        <div className="mt-6 space-y-4">
          <div><label className="label">Full name</label><input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label">Password</label><input className="field" type="password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        </div>
        <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-brand-600">Sign in</Link></p>
      </form>
    </main>
  );
}
