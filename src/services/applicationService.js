import { api } from './api';

export const applicationService = {
  apply: (jobId, resume, coverLetter) => {
    const form = new FormData();
    form.append('job_id', String(jobId));
    form.append('resume', resume);
    if (coverLetter) form.append('cover_letter', coverLetter);
    return api.post('/api/applications', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMine: (params) => api.get('/api/applications/me', { params }),
  getByJob: (jobId, params) => api.get(`/api/jobs/${jobId}/applications`, { params }),
  get: (id) => api.get(`/api/applications/${id}`),
  updateStatus: (id, status) => api.patch(`/api/applications/${id}/status`, { status }),
  withdraw: (id) => api.delete(`/api/applications/${id}`),
};

export const getApplicationResumeUrl = (application) => {
  const resume = application.resumeUrl ?? application.resume_url ?? application.resume;
  const url = typeof resume === 'string' ? resume : resume?.url;
  return typeof url === 'string' && url.trim()
    ? new URL(url, api.defaults.baseURL).href
    : null;
};
