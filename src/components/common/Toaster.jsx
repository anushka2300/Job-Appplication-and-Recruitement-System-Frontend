import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

const ToasterContext = createContext(null);

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const contextValue = useMemo(() => ({ show }), [show]);
  return (
    <ToasterContext.Provider value={contextValue}>
      {children}
      <div className="fixed right-4 top-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`flex min-w-72 items-center gap-3 rounded-lg border bg-white p-3 shadow-lg ${toast.type === 'error' ? 'border-red-200' : 'border-emerald-200'}`}>
            <FontAwesomeIcon icon={toast.type === 'error' ? faCircleExclamation : faCircleCheck} className={toast.type === 'error' ? 'text-red-600' : 'text-emerald-600'} />
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="text-slate-400"><FontAwesomeIcon icon={faXmark} /></button>
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  );
}

export const useToaster = () => useContext(ToasterContext);
