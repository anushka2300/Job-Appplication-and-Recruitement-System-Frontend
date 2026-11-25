import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center px-4">
      <div className="text-center">
        <FontAwesomeIcon icon={faLock} className="text-4xl text-slate-300" />
        <h1 className="mt-4 text-3xl font-bold">Access denied</h1>
        <p className="mt-2 text-slate-500">You do not have permission to view this page.</p>
        <Link to="/" className="btn-primary mt-6">Go home</Link>
      </div>
    </main>
  );
}
