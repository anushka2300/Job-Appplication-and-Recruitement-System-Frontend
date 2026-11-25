import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import Loader from '../../components/common/Loader';
import { useToaster } from '../../components/common/Toaster';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toaster = useToaster();

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await companyService.getAdminStats();
      setStats(data.data);
    } catch (error) {
      toaster.show(error.response?.data?.message || 'Unable to load platform statistics', 'error');
    } finally {
      setLoading(false);
    }
  }, [toaster]);

  useEffect(() => { loadStats(); }, [loadStats]);

  if (loading) return <Loader />;
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Platform administration</h1>
        <p className="mt-1 text-slate-500">Manage companies and their onboarding.</p>
      </div>
      {stats ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5"><p className="text-sm text-slate-500">Companies</p><p className="mt-2 text-3xl font-bold">{stats.companiesCount}</p></div>
          <div className="card p-5"><p className="text-sm text-slate-500">Company admins</p><p className="mt-2 text-3xl font-bold">{stats.adminsCount}</p></div>
          <div className="card p-5"><p className="text-sm text-slate-500">Pending invitations</p><p className="mt-2 text-3xl font-bold">{stats.pendingInvitationsCount}</p></div>
        </div>
      ) : (
        <div className="card p-5">
          <p className="text-sm text-slate-600">Platform statistics are unavailable.</p>
          <button type="button" className="btn-secondary mt-4" onClick={loadStats}>Try again</button>
        </div>
      )}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Company onboarding</h2>
        <p className="mt-1 text-sm text-slate-500">Create an organization, then invite its first administrator.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <p className="font-semibold">Create a company</p>
            <p className="mt-1 text-sm text-slate-500">Register a new organization on the platform.</p>
            <Link to="/admin/companies" className="btn-primary mt-4 inline-flex">Create company</Link>
          </div>
          <div className="card p-5">
            <p className="font-semibold">Invite a company admin</p>
            <p className="mt-1 text-sm text-slate-500">Choose a company and send its administrator an invitation.</p>
            <Link to="/admin/companies" className="btn-secondary mt-4 inline-flex">Manage companies</Link>
          </div>
        </div>
      </section>
      <div className="mt-6 flex gap-3">
        <Link to="/admin/invitations" className="btn-secondary">View invitations</Link>
        <Link to="/admin/jobs" className="btn-secondary">View all jobs</Link>
      </div>
    </div>
  );
}
