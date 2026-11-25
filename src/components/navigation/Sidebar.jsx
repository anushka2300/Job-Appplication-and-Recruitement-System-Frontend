import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faBriefcase, faUsers, faGauge, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';

const links = {
  CANDIDATE: [
    ['Browse jobs', '/candidate/jobs', faBriefcase],
    ['My applications', '/candidate/applications', faPaperPlane],
    ['Profile', '/candidate/profile', faUser],
  ],
  RECRUITER: [
    ['Dashboard', '/recruiter', faGauge],
    ['Manage jobs', '/recruiter/jobs', faBriefcase],
  ],
  ADMIN: [
    ['Dashboard', '/company', faGauge],
    ['Jobs', '/company/jobs', faBriefcase],
    ['Recruiters', '/company/recruiters', faUsers],
  ],
  SUPER_ADMIN: [
    ['Dashboard', '/admin', faGauge],
    ['Companies', '/admin/companies', faBuilding],
    ['Invitations', '/admin/invitations', faPaperPlane],
    ['All jobs', '/admin/jobs', faBriefcase],
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <nav className="space-y-1">
        {(links[user?.role] || []).map(([label, to, icon]) => (
          <NavLink key={to} to={to} end={to === '/recruiter' || to === '/company' || to === '/admin'} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <FontAwesomeIcon icon={icon} className="w-4" /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
