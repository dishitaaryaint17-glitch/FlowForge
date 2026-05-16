import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => (
  <div className="app-shell noise-bg flex min-h-screen text-[var(--foreground)]">
    <Sidebar />
    <main className="flex-1 min-w-0 p-4 lg:p-5">
      <Navbar />
      <div className="mt-4">
        <Outlet />
      </div>
    </main>
  </div>
);

export default DashboardLayout;
