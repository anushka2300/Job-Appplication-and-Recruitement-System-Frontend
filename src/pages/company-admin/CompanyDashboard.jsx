import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Loader from '../../components/common/Loader';

export default function CompanyDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { jobService.list({ limit: 100 }).then(({ data }) => setJobs(data.data || [])).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6"><h1 className="text-2xl font-bold">Company dashboard</h1><p className="mt-1 text-slate-500">Overview of company recruitment activity.</p></div>
      <div className="grid gap-4 md:grid-cols-3"><div className="card p-5"><p className="text-sm text-slate-500">Company jobs</p><p className="mt-2 text-3xl font-bold">{jobs.length}</p></div><div className="card p-5"><p className="text-sm text-slate-500">Published</p><p className="mt-2 text-3xl font-bold">{jobs.filter((j) => j.status === 'PUBLISHED').length}</p></div><div className="card p-5"><p className="text-sm text-slate-500">Draft</p><p className="mt-2 text-3xl font-bold">{jobs.filter((j) => j.status === 'DRAFT').length}</p></div></div>
      <div className="mt-6 flex gap-3"><Link to="/company/jobs" className="btn-primary">Manage jobs</Link><Link to="/company/recruiters" className="btn-secondary">Invite staff</Link></div>
    </div>
  );
}
