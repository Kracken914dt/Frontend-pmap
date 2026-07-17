import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { clearAuthSession, getAuthUser } from '../utils/storage';

export default function MainLayout() {
  const navigate = useNavigate();
  const user = getAuthUser();

  function handleLogout() {
    clearAuthSession();
    navigate('/login');
  }

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar onLogout={handleLogout} userName={user?.nombres ?? 'Usuario'} />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <main className="rounded-3xl border border-white/10 bg-white/6 p-4 shadow-glow backdrop-blur-xl lg:p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}