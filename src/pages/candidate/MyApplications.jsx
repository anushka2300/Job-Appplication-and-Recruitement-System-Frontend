import { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { useToaster } from '../../components/common/Toaster';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [withdraw, setWithdraw] = useState(null);
  const toaster = useToaster();

  const load = () => applicationService.getMine({ page, limit: 10 }).then(({ data }) => { setApplications(data.data || []); setPagination(data.pagination); }).finally(() => setLoading(false));
  useEffect(() => { setLoading(true); load(); }, [page]);

  const confirmWithdraw = async () => {
    try { await applicationService.withdraw(withdraw.id); toaster.show('Application withdrawn'); setWithdraw(null); load(); }
    catch (error) { toaster.show(error.response?.data?.message || 'Unable to withdraw', 'error'); }
  };

  if (loading) return <Loader />;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6"><h1 className="text-2xl font-bold">My applications</h1><p className="mt-1 text-slate-500">Track your submitted applications.</p></div>
      {applications.length === 0 ? <div className="card"><EmptyState title="No applications yet" message="Apply to a published job to see it here." /></div> : (
        <div className="card overflow-hidden"><div className="divide-y">{applications.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-semibold">{item.jobTitle || `Job #${item.jobId}`}</p><p className="mt-1 text-xs text-slate-500">Applied {new Date(item.appliedAt).toLocaleDateString()}</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{item.status}</span>{!['SELECTED','REJECTED','WITHDRAWN'].includes(item.status) && <button className="text-sm font-medium text-red-600" onClick={() => setWithdraw(item)}>Withdraw</button>}</div></div>)}</div><Pagination pagination={pagination} onPageChange={setPage} /></div>
      )}
      <Modal open={Boolean(withdraw)} title="Withdraw application" onClose={() => setWithdraw(null)}><p className="text-sm text-slate-600">This action cannot be undone.</p><div className="mt-5 flex justify-end gap-2"><button className="btn-secondary" onClick={() => setWithdraw(null)}>Cancel</button><button className="btn-danger" onClick={confirmWithdraw}>Withdraw</button></div></Modal>
    </div>
  );
}
