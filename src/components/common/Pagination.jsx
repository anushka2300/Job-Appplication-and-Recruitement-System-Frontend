export default function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;
  const pages = Math.max(1, Math.ceil(pagination.total / pagination.limit));
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm">
      <span className="text-slate-500">{pagination.total} total</span>
      <div className="flex gap-2">
        <button className="btn-secondary px-3 py-1.5" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>Previous</button>
        <span className="px-2 py-1.5">{pagination.page} / {pages}</span>
        <button className="btn-secondary px-3 py-1.5" disabled={pagination.page >= pages} onClick={() => onPageChange(pagination.page + 1)}>Next</button>
      </div>
    </div>
  );
}
