import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToaster } from '../../components/common/Toaster';
import { ROLE_DASHBOARD } from '../../routes/routeConfig';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toaster = useToaster();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      navigate(ROLE_DASHBOARD[user.role] || '/unauthorized', { replace: true });
    } catch (error) {
      toaster.show(error.response?.data?.message || 'Unable to sign in', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center px-4 py-10">
      <form onSubmit={submit} className="card w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to your recruitment workspace.</p>
        <div className="mt-6 space-y-4">
          <div><label className="label">Email</label><input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label">Password</label><input className="field" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        </div>
        <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <p className="mt-5 text-center text-sm text-slate-500">New candidate? <Link to="/register" className="font-semibold text-brand-600">Create an account</Link></p>
      </form>
    </main>
  );
}
