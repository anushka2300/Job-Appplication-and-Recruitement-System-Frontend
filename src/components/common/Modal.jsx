import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
