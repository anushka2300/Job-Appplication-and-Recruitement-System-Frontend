import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { useToaster } from '../../components/common/Toaster';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';

const emptyCompany = { name: '', description: '', website: '', location: '' };

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(emptyCompany);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const toaster = useToaster();

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const { data } = await companyService.list();
      setCompanies(data.data);
    } catch (error) {
      setLoadError(true);
      toaster.show(error.response?.data?.message || 'Unable to load companies', 'error');
    } finally {
      setLoading(false);
    }
  }, [toaster]);

  useEffect(() => { loadCompanies(); }, [loadCompanies]);

  const createCompany = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await companyService.create(company);
      toaster.show('Company created');
      setCompany(emptyCompany);
      await loadCompanies();
    } catch (error) {
      toaster.show(error.response?.data?.message || 'Unable to create company', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Companies</h1>
        <p className="mt-1 text-slate-500">Manage registered organizations and their administrators.</p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
        <section className="card p-6">
          <h2 className="font-semibold">Registered companies</h2>
          {loading ? <Loader /> : loadError ? (
            <div className="py-6">
              <p className="text-sm text-slate-600">Companies could not be loaded.</p>
              <button type="button" className="btn-secondary mt-3" onClick={loadCompanies}>Try again</button>
            </div>
          ) : companies.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-xs uppercase text-slate-500">
                  <tr><th className="py-3 pr-4">Company</th><th className="py-3 pr-4">Location</th><th className="py-3 pr-2">Status</th><th className="py-3"> </th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">Company #{item.id}</p>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{item.location || '—'}</td>
                      <td className="py-3 pr-2 text-slate-600">{item.status || 'Active'}</td>
                      <td className="py-3 text-right"><Link className="font-semibold text-brand-700 hover:underline" to={`/admin/companies/${item.id}`}>View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState title="No companies yet" message="Create a company to start onboarding its administrator." />}
        </section>

        <form onSubmit={createCompany} className="card p-6">
          <h2 className="mb-4 font-semibold">Create a company</h2>
          <div className="space-y-4">
            <div><label className="label" htmlFor="company-name">Company name</label><input id="company-name" className="field" required value={company.name} onChange={(event) => setCompany({ ...company, name: event.target.value })} /></div>
            <div><label className="label" htmlFor="company-description">Description</label><textarea id="company-description" className="field" value={company.description} onChange={(event) => setCompany({ ...company, description: event.target.value })} /></div>
            <div><label className="label" htmlFor="company-website">Website</label><input id="company-website" className="field" type="url" value={company.website} onChange={(event) => setCompany({ ...company, website: event.target.value })} /></div>
            <div><label className="label" htmlFor="company-location">Location</label><input id="company-location" className="field" value={company.location} onChange={(event) => setCompany({ ...company, location: event.target.value })} /></div>
            <button className="btn-primary w-full" disabled={submitting}>{submitting ? 'Creating...' : 'Create company'}</button>
          </div>
        </form>
      </div>
      <div className="mt-6"><Link to="/admin/invitations" className="btn-secondary">Track invitations</Link></div>
    </div>
  );
}
