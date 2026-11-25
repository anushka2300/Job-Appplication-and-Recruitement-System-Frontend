import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <Link to="/" className="flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white"><FontAwesomeIcon icon={faBriefcase} /></span>RecruitHub</Link>
        <div className="flex gap-2">
          <Link to="/login" className="btn-secondary">Sign in</Link>
          <Link to="/register" className="btn-primary">Create account</Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
