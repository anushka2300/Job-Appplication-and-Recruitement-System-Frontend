import { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import { applicationService, getApplicationResumeUrl } from '../../services/applicationService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { useToaster } from '../../components/common/Toaster';
import { useAuth } from '../../hooks/useAuth';

const blank = { title: '', description: '', location: '', employment_type: 'FULL_TIME', experience_min: null, experience_max: null, salary_min: null, salary_max: null, skills: [], company_id: null };

export default function ManageJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [deleteJob, setDeleteJob] = useState(null);
  const [applicationsJob, setApplicationsJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const toaster = useToaster();

  const load = () => jobService.list({ page, limit: 10 }).then(({ data }) => { setJobs(data.data || []); setPagination(data.pagination); }).finally(() => setLoading(false));
  useEffect(() => { setLoading(true); load(); }, [page]);

  const openCreate = () => { setEditing('new'); setForm(blank); };
  const openEdit = (job) => { setEditing(job.id); setForm({ ...job, skills: Array.isArray(job.skills) ? job.skills : [] }); };
  const submit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, skills: typeof form.skills === 'string' ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : form.skills };
      if (user?.role !== 'SUPER_ADMIN') delete payload.company_id;
      else if (payload.company_id !== null) payload.company_id = Number(payload.company_id);
      if (editing === 'new') await jobService.create(payload);
      else await jobService.update(editing, payload);
      toaster.show(editing === 'new' ? 'Job created' : 'Job updated');
      setEditing(null); load();
    } catch (error) { toaster.show(error.response?.data?.message || 'Unable to save job', 'error'); }
  };
  const togglePublish = async (job) => {
    try { await jobService.setPublished(job.id, job.status !== 'PUBLISHED'); toaster.show('Publication updated'); load(); }
    catch (error) { toaster.show(error.response?.data?.message || 'Unable to update publication', 'error'); }
  };
  const confirmDelete = async () => {
    try { await jobService.remove(deleteJob.id); toaster.show('Job deleted'); setDeleteJob(null); load(); }
    catch (error) { toaster.show(error.response?.data?.message || 'Unable to delete job', 'error'); }
  };
  const openApplications = async (job) => {
    setApplicationsJob(job);
    try { const { data } = await applicationService.getByJob(job.id, { limit: 100 }); setApplications(data.data || []); }
    catch (error) { toaster.show(error.response?.data?.message || 'Unable to load applications', 'error'); setApplications([]); }
  };
  const updateStatus = async (application, status) => {
    try { await applicationService.updateStatus(application.id, status); setApplications((items) => items.map((item) => item.id === application.id ? { ...item, status } : item)); toaster.show('Status updated'); }
    catch (error) { toaster.show(error.response?.data?.message || 'Unable to update status', 'error'); }
  };

  if (loading) return <Loader />;
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between"><div><h1 className="text-2xl font-bold">Manage jobs</h1><p className="mt-1 text-slate-500">Create and manage job postings.</p></div><button className="btn-primary" onClick={openCreate}>Create job</button></div>
      {jobs.length === 0 ? <div className="card"><EmptyState title="No jobs yet" /></div> : <div className="card overflow-hidden"><div className="divide-y">{jobs.map((job) => <div key={job.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-semibold">{job.title}</p><p className="mt-1 text-xs text-slate-500">{job.location || 'No location'} · {job.status}</p></div><div className="flex flex-wrap gap-2"><button className="btn-secondary px-3 py-1.5" onClick={() => openApplications(job)}>Applications</button><button className="btn-secondary px-3 py-1.5" onClick={() => openEdit(job)}>Edit</button><button className="btn-secondary px-3 py-1.5" onClick={() => togglePublish(job)}>{job.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button><button className="text-sm font-medium text-red-600" onClick={() => setDeleteJob(job)}>Delete</button></div></div>)}</div><Pagination pagination={pagination} onPageChange={setPage} /></div>}
      <Modal open={Boolean(editing)} title={editing === 'new' ? 'Create job' : 'Edit job'} onClose={() => setEditing(null)}>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label className="label">Title</label><input className="field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div><div className="sm:col-span-2"><label className="label">Description</label><textarea className="field min-h-28" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><div><label className="label">Location</label><input className="field" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div><div><label className="label">Employment type</label><select className="field" value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })}><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="INTERNSHIP">Internship</option><option value="CONTRACT">Contract</option></select></div>{user?.role === 'SUPER_ADMIN' && editing === 'new' && <div className="sm:col-span-2"><label className="label">Company ID</label><input className="field" type="number" min="1" required value={form.company_id ?? ''} onChange={(e) => setForm({ ...form, company_id: e.target.value })} /></div>}<div><label className="label">Minimum experience</label><input className="field" type="number" min="0" value={form.experience_min ?? ''} onChange={(e) => setForm({ ...form, experience_min: e.target.value === '' ? null : Number(e.target.value) })} /></div><div><label className="label">Maximum experience</label><input className="field" type="number" min="0" value={form.experience_max ?? ''} onChange={(e) => setForm({ ...form, experience_max: e.target.value === '' ? null : Number(e.target.value) })} /></div><div><label className="label">Minimum salary</label><input className="field" type="number" min="0" value={form.salary_min ?? ''} onChange={(e) => setForm({ ...form, salary_min: e.target.value === '' ? null : Number(e.target.value) })} /></div><div><label className="label">Maximum salary</label><input className="field" type="number" min="0" value={form.salary_max ?? ''} onChange={(e) => setForm({ ...form, salary_max: e.target.value === '' ? null : Number(e.target.value) })} /></div><div className="sm:col-span-2"><label className="label">Skills (comma separated)</label><input className="field" value={typeof form.skills === 'string' ? form.skills : form.skills.join(', ')} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></div><div className="sm:col-span-2 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="btn-primary">Save job</button></div></form>
      </Modal>
      <Modal open={Boolean(deleteJob)} title="Delete job" onClose={() => setDeleteJob(null)}><p className="text-sm text-slate-600">Delete <strong>{deleteJob?.title}</strong>? This action cannot be undone.</p><div className="mt-5 flex justify-end gap-2"><button className="btn-secondary" onClick={() => setDeleteJob(null)}>Cancel</button><button className="btn-danger" onClick={confirmDelete}>Delete</button></div></Modal>
      <Modal open={Boolean(applicationsJob)} title={`Applications: ${applicationsJob?.title || ''}`} onClose={() => setApplicationsJob(null)}>
        {applications.length === 0 ? <EmptyState title="No applications" /> : <div className="divide-y">{applications.map((item) => {
          const resumeUrl = getApplicationResumeUrl(item);
          return <div key={item.id} className="py-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{item.candidateName}</p><p className="text-sm text-slate-500">{item.candidateEmail}</p></div><div className="flex items-center gap-2"><select className="field w-36" value={item.status} onChange={(e) => updateStatus(item, e.target.value)}>{['APPLIED','SHORTLISTED','INTERVIEW','SELECTED','REJECTED','WITHDRAWN'].map((status) => <option key={status}>{status}</option>)}</select>{resumeUrl ? <a className="btn-secondary px-3 py-2" href={resumeUrl} target="_blank" rel="noreferrer">View resume</a> : <span className="text-sm text-slate-400">Resume unavailable</span>}</div></div>{item.coverLetter && <p className="mt-3 text-sm text-slate-600">{item.coverLetter}</p>}</div>;
        })}</div>}
      </Modal>
    </div>
  );
}
