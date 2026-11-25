import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_DASHBOARD } from './routeConfig';

export default function RoleBasedRoute({ roles }) {
  const { user } = useAuth();
  if (roles.includes(user?.role)) return <Outlet />;
  return <Navigate to={ROLE_DASHBOARD[user?.role] || '/unauthorized'} replace />;
}
