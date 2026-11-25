import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Loader from '../../components/common/Loader';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { jobService.list({ limit: 100 }).then(({ data }) => setJobs(data.data || [])).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  const published = jobs.filter((job) => job.status === 'PUBLISHED').length;
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6"><h1 className="text-2xl font-bold">Recruiter dashboard</h1><p className="mt-1 text-slate-500">Manage your recruitment activity.</p></div>
      <div className="grid gap-4 md:grid-cols-3"><div className="card p-5"><p className="text-sm text-slate-500">Visible jobs</p><p className="mt-2 text-3xl font-bold">{jobs.length}</p></div><div className="card p-5"><p className="text-sm text-slate-500">Published</p><p className="mt-2 text-3xl font-bold">{published}</p></div><div className="card p-5"><p className="text-sm text-slate-500">Draft jobs</p><p className="mt-2 text-3xl font-bold">{jobs.length - published}</p></div></div>
      <div className="card mt-6 p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Recent jobs</h2><Link to="/recruiter/jobs" className="text-sm font-semibold text-brand-600">Manage jobs</Link></div>{jobs.slice(0, 5).map((job) => <div key={job.id} className="mt-3 rounded-lg border p-4"><p className="font-medium">{job.title}</p><p className="mt-1 text-xs text-slate-500">{job.status} · {job.location || 'Location not specified'}</p></div>)}</div>
    </div>
  );
}
