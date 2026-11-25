import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLE_DASHBOARD } from './routeConfig';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import BrowseJobs from '../pages/candidate/BrowseJobs';
import JobDetails from '../pages/candidate/JobDetails';
import MyApplications from '../pages/candidate/MyApplications';
import CandidateProfile from '../pages/candidate/CandidateProfile';
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import ManageJobs from '../pages/recruiter/ManageJobs';
import CompanyDashboard from '../pages/company-admin/CompanyDashboard';
import CompanyJobs from '../pages/company-admin/CompanyJobs';
import CompanyRecruiters from '../pages/company-admin/CompanyRecruiters';
import AdminDashboard from '../pages/super-admin/AdminDashboard';
import ManageCompanies from '../pages/super-admin/ManageCompanies';
import CompanyDetails from '../pages/super-admin/CompanyDetails';
import AdminInvitations from '../pages/super-admin/AdminInvitations';
import AllJobs from '../pages/super-admin/AllJobs';

function RoleLandingRedirect({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (user) {
    return <Navigate to={ROLE_DASHBOARD[user.role] || '/unauthorized'} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RoleLandingRedirect><LandingPage /></RoleLandingRedirect>} />
        <Route path="/login" element={<RoleLandingRedirect><LoginPage /></RoleLandingRedirect>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleBasedRoute roles={['CANDIDATE']} />}>
            <Route path="/candidate/jobs" element={<BrowseJobs />} />
            <Route path="/candidate/jobs/:id" element={<JobDetails />} />
            <Route path="/candidate/applications" element={<MyApplications />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
          </Route>
          <Route element={<RoleBasedRoute roles={['RECRUITER']} />}>
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs" element={<ManageJobs />} />
          </Route>
          <Route element={<RoleBasedRoute roles={['ADMIN']} />}>
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/jobs" element={<CompanyJobs />} />
            <Route path="/company/recruiters" element={<CompanyRecruiters />} />
          </Route>
          <Route element={<RoleBasedRoute roles={['SUPER_ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/companies/:id" element={<CompanyDetails />} />
            <Route path="/admin/companies" element={<ManageCompanies />} />
            <Route path="/admin/invitations" element={<AdminInvitations />} />
            <Route path="/admin/jobs" element={<AllJobs />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
