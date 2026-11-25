import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white"><FontAwesomeIcon icon={faBriefcase} /></span>
        RecruitHub
      </Link>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>
        <button onClick={logout} className="btn-secondary px-3" title="Logout"><FontAwesomeIcon icon={faArrowRightFromBracket} /><span className="hidden sm:inline">Logout</span></button>
      </div>
    </header>
  );
}
