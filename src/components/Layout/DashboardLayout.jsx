import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { useSidebar } from '../../context/SidebarContext';

export default function DashboardLayout() {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      <Navbar />
      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
