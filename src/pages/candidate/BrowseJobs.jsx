import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { jobService } from '../../services/jobService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useDebounce } from '../../hooks/useDebounce';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', location: '', employment_type: '', page: 1, limit: 12 });
  const debouncedQ = useDebounce(filters.q);

  useEffect(() => {
    let active = true;
    setLoading(true);
    jobService.list({ ...filters, q: debouncedQ })
      .then(({ data }) => { if (active) { setJobs(data.data || []); setPagination(data.pagination); } })
      .catch(() => { if (active) setJobs([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [debouncedQ, filters.location, filters.employment_type, filters.page, filters.limit]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6"><h1 className="text-2xl font-bold">Browse jobs</h1><p className="mt-1 text-slate-500">Find your next opportunity.</p></div>
      <div className="card mb-6 grid gap-3 p-4 md:grid-cols-[1fr_220px_180px]">
        <input className="field" placeholder="Search title or skills..." value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })} />
        <input className="field" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value, page: 1 })} />
        <select className="field" value={filters.employment_type} onChange={(e) => setFilters({ ...filters, employment_type: e.target.value, page: 1 })}>
          <option value="">All types</option><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="INTERNSHIP">Internship</option><option value="CONTRACT">Contract</option>
        </select>
      </div>
      {loading ? <Loader /> : jobs.length === 0 ? <div className="card"><EmptyState title="No jobs found" /></div> : (
        <div className="card overflow-hidden">
          <div className="divide-y">{jobs.map((job) => (
            <Link key={job.id} to={`/candidate/jobs/${job.id}`} className="block p-5 transition hover:bg-slate-50">
              <div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">{job.title}</h2><p className="mt-1 text-sm text-slate-500">{job.location || 'Location not specified'} · {job.employment_type?.replace('_', ' ')}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{job.status}</span></div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">{job.description}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500"><span><FontAwesomeIcon icon={faLocationDot} className="mr-1" />{job.location || 'Remote'}</span>{job.salary_min != null && <span><FontAwesomeIcon icon={faSackDollar} className="mr-1" />{job.salary_min} - {job.salary_max}</span>}</div>
            </Link>
          ))}</div>
          <Pagination pagination={pagination} onPageChange={(page) => setFilters({ ...filters, page })} />
        </div>
      )}
    </div>
  );
}
