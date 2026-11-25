import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { useToaster } from '../../components/common/Toaster';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toaster = useToaster();

  useEffect(() => {
    jobService.get(id).then(({ data }) => setJob(data.data)).finally(() => setLoading(false));
  }, [id]);

  const apply = async (event) => {
    event.preventDefault();
    if (!resume) return toaster.show('Please select a PDF resume', 'error');
    setSubmitting(true);
    try {
      await applicationService.apply(id, resume, coverLetter);
      toaster.show('Application submitted');
      setOpen(false);
    } catch (error) {
      toaster.show(error.response?.data?.message || 'Unable to apply', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!job) return <div className="card p-8 text-center">Job not found.</div>;
  return (
    <div className="mx-auto max-w-4xl">
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">{job.title}</h1><p className="mt-1 text-slate-500">{job.location || 'Location not specified'} · {job.employment_type?.replace('_', ' ')}</p></div>{job.status === 'PUBLISHED' && <button className="btn-primary" onClick={() => setOpen(true)}>Apply now</button>}</div>
        <div className="mt-6 grid gap-5 border-t pt-6 md:grid-cols-2"><div><h2 className="label">Description</h2><p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{job.description}</p></div><div className="space-y-3 text-sm"><p><span className="font-medium">Experience:</span> {job.experience_min ?? '-'}–{job.experience_max ?? '-'} years</p><p><span className="font-medium">Salary:</span> {job.salary_min != null ? `${job.salary_min} - ${job.salary_max}` : 'Not specified'}</p><p><span className="font-medium">Skills:</span> {Array.isArray(job.skills) ? job.skills.join(', ') : 'Not specified'}</p></div></div>
      </div>
      <Modal open={open} title="Submit application" onClose={() => setOpen(false)}>
        <form onSubmit={apply} className="space-y-4">
          <div><label className="label">Resume (PDF, max 5 MB)</label><input className="field" type="file" accept=".pdf,application/pdf" required onChange={(e) => setResume(e.target.files?.[0] || null)} /></div>
          <div><label className="label">Cover letter (optional)</label><textarea className="field min-h-28" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} /></div>
          <button className="btn-primary w-full" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit application'}</button>
        </form>
      </Modal>
    </div>
  );
}
