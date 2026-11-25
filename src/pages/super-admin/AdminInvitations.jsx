import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { useToaster } from '../../components/common/Toaster';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';

export default function AdminInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const toaster = useToaster();

  const loadInvitations = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const { data } = await companyService.listInvitations();
      setInvitations(data.data);
    } catch (error) {
      setLoadError(true);
      toaster.show(error.response?.data?.message || 'Unable to load invitations', 'error');
    } finally {
      setLoading(false);
    }
  }, [toaster]);

  useEffect(() => { loadInvitations(); }, [loadInvitations]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Invitations</h1><p className="mt-1 text-slate-500">Track company administrator invitations.</p></div>
        <Link to="/admin/companies" className="btn-primary">Invite an admin</Link>
      </div>
      <section className="card p-6">
        <h2 className="font-semibold">Company admin invitations</h2>
        {loading ? <Loader /> : loadError ? (
          <div className="py-6">
            <p className="text-sm text-slate-600">Invitations could not be loaded.</p>
            <button type="button" className="btn-secondary mt-3" onClick={loadInvitations}>Try again</button>
          </div>
        ) : invitations.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs uppercase text-slate-500">
                <tr><th className="py-3 pr-4">Invitee</th><th className="py-3 pr-4">Company</th><th className="py-3 pr-4">Role</th><th className="py-3 pr-4">Status</th><th className="py-3">Created</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td className="py-3 pr-4"><p className="font-medium">{invitation.adminName || invitation.admin_name || invitation.name}</p><p className="text-slate-500">{invitation.adminEmail || invitation.admin_email || invitation.email}</p></td>
                    <td className="py-3 pr-4"><Link className="text-brand-700 hover:underline" to={`/admin/companies/${invitation.companyId ?? invitation.company_id}`}>{invitation.companyName || invitation.company_name || `Company #${invitation.companyId ?? invitation.company_id}`}</Link></td>
                    <td className="py-3 pr-4">{invitation.role}</td>
                    <td className="py-3 pr-4">{invitation.status}</td>
                    <td className="py-3">{(invitation.createdAt || invitation.created_at) ? new Date(invitation.createdAt || invitation.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="No invitations yet" message="Invitations sent to company admins will appear here." />}
      </section>
    </div>
  );
}
