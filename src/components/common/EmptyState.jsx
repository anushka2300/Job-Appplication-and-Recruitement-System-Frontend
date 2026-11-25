import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function EmptyState({ title = 'Nothing found', message = 'Try adjusting your filters.' }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="mb-3 text-2xl text-slate-300" />
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
