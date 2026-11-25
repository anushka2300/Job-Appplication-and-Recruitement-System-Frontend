import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
