import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { useToaster } from '../../components/common/Toaster';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';

const getInvitationCompanyId = (invitation) => invitation.companyId ?? invitation.company_id;
const getInvitationName = (invitation) => invitation.adminName ?? invitation.admin_name ?? invitation.name;
const getInvitationEmail = (invitation) => invitation.adminEmail ?? invitation.admin_email ?? invitation.email;

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [form, setForm] = useState({ adminName: '', adminEmail: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [invitationsError, setInvitationsError] = useState(false);
  const toaster = useToaster();

  const loadCompany = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    setInvitationsError(false);
    const [companyResult, invitationsResult] = await Promise.allSettled([
      companyService.get(id),
      companyService.listInvitations(),
    ]);

    if (companyResult.status === 'fulfilled') {
      setCompany(companyResult.value.data.data);
    } else {
      setLoadError(true);
      toaster.show(companyResult.reason.response?.data?.message || 'Unable to load company', 'error');
    }

    if (invitationsResult.status === 'fulfilled') {
      setInvitations(invitationsResult.value.data.data);
    } else {
      setInvitationsError(true);
      toaster.show(invitationsResult.reason.response?.data?.message || 'Unable to load company invitations', 'error');
    }

    setLoading(false);
  }, [id, toaster]);

  useEffect(() => { loadCompany(); }, [loadCompany]);

  const inviteAdmin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await companyService.invite({
        companyId: Number(id),
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        role: 'ADMIN',
      });
      toaster.show('Company admin invitation created');
      setForm({ adminName: '', adminEmail: '' });
    } catch (error) {
      toaster.show(error.response?.data?.message || 'Unable to create invitation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (loadError || !company) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-slate-600">Company details could not be loaded.</p>
        <button type="button" className="btn-secondary mt-3" onClick={loadCompany}>Try again</button>
      </div>
    );
  }

  const companyInvitations = invitations.filter((invitation) => (
    String(getInvitationCompanyId(invitation)) === id
    && ['ADMIN', 'RECRUITER'].includes(String(invitation.role).toUpperCase())
  ));

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/admin/companies" className="text-sm font-semibold text-brand-700 hover:underline">← Companies</Link>
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold">{company.name}</h1>
        <p className="mt-1 text-slate-500">Company #{company.id}{company.location ? ` · ${company.location}` : ''}</p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
        <section className="card p-6">
          <h2 className="font-semibold">Company information</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div><dt className="text-slate-500">Description</dt><dd className="mt-1 text-slate-800">{company.description || '—'}</dd></div>
            <div><dt className="text-slate-500">Website</dt><dd className="mt-1">{company.website ? <a className="text-brand-700 hover:underline" href={company.website} target="_blank" rel="noreferrer">{company.website}</a> : '—'}</dd></div>
            <div><dt className="text-slate-500">Location</dt><dd className="mt-1 text-slate-800">{company.location || '—'}</dd></div>
          </dl>
          <div className="mt-8">
            <h2 className="font-semibold">Admins and recruiters</h2>
            <p className="mt-1 text-sm text-slate-500">Invitation records for this company, including their acceptance status.</p>
            {invitationsError ? (
              <div className="py-5">
                <p className="text-sm text-slate-600">Company invitations could not be loaded.</p>
                <button type="button" className="btn-secondary mt-3" onClick={loadCompany}>Try again</button>
              </div>
            ) : companyInvitations.length ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase text-slate-500">
                    <tr><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Email</th><th className="py-3 pr-4">Role</th><th className="py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {companyInvitations.map((invitation) => (
                      <tr key={invitation.id}>
                        <td className="py-3 pr-4 font-medium">{getInvitationName(invitation) || '—'}</td>
                        <td className="py-3 pr-4 text-slate-600">{getInvitationEmail(invitation) || '—'}</td>
                        <td className="py-3 pr-4">{invitation.role}</td>
                        <td className="py-3">{invitation.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <EmptyState title="No admin or recruiter records" message="Admin and recruiter invitations for this company will appear here." />}
          </div>
        </section>
        <form onSubmit={inviteAdmin} className="card p-6">
          <h2 className="font-semibold">Invite company admin</h2>
          <p className="mt-1 text-sm text-slate-500">The invitation will automatically be associated with {company.name}.</p>
          <div className="mt-4 space-y-4">
            <div><label className="label" htmlFor="admin-name">Admin name</label><input id="admin-name" className="field" required value={form.adminName} onChange={(event) => setForm({ ...form, adminName: event.target.value })} /></div>
            <div><label className="label" htmlFor="admin-email">Admin email</label><input id="admin-email" className="field" type="email" required value={form.adminEmail} onChange={(event) => setForm({ ...form, adminEmail: event.target.value })} /></div>
            <div><label className="label" htmlFor="admin-role">Role</label><input id="admin-role" className="field" value="ADMIN" readOnly /></div>
            <button className="btn-primary w-full" disabled={submitting}>{submitting ? 'Sending invitation...' : 'Invite admin'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
