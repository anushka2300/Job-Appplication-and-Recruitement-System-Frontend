import { api } from './api';

export const companyService = {
  list: () => api.get('/api/companies'),
  get: (id) => api.get(`/api/companies/${id}`),
  create: (payload) => api.post('/api/companies', payload),
  invite: (payload) => api.post('/api/companies/invite_admin', payload),
  listInvitations: () => api.get('/api/companies/invitations'),
  acceptInvitation: (payload) => api.post('/api/companies/invitations/accept', payload),
  getAdminStats: () => api.get('/api/admin/stats'),
};
