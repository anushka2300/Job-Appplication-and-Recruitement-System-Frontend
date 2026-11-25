import { api } from './api';

export const jobService = {
  list: (params) => api.get('/api/jobs', { params }),
  get: (id) => api.get(`/api/jobs/${id}`),
  create: (payload) => api.post('/api/jobs', payload),
  update: (id, payload) => api.put(`/api/jobs/${id}`, payload),
  remove: (id) => api.delete(`/api/jobs/${id}`),
  setPublished: (id, published) => api.patch(`/api/jobs/${id}/publish`, { published }),
};
