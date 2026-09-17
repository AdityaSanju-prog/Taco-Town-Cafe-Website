import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Menu as MenuIcon, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import tacoLogo from '../assets/taco-logo.png';

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('chachu_admin_token');
    if (!token) {
      toast.error('Session expired. Please log in as admin.');
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('chachu_admin_token');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Menu', path: '/admin/menu', icon: MenuIcon },
  ];

  return (
    <div className="min-h-screen bg-cafe-bg flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-secondary flex-col fixed h-full z-20 shadow-xl">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src={tacoLogo}
              alt="Taco Town Logo"
              className="w-8 h-8 object-contain rounded-lg bg-white p-0.5 shadow-sm"
            />
            <div>
              <p className="font-display font-bold text-white text-sm">Taco Town Admin</p>
              <p className="text-gray-400 text-xs">Café Management</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-medium text-sm transition-all w-full"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top & Bottom Navigation */}
      <div className="md:hidden sticky top-0 z-30 bg-secondary border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <img src={tacoLogo} alt="Logo" className="w-7 h-7 object-contain bg-white rounded p-0.5" />
          <span className="font-display font-bold text-white text-base">Taco Town Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-semibold text-red-400 hover:text-red-300 bg-red-400/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden sticky top-[53px] z-20 bg-secondary/95 backdrop-blur-md px-2 py-1.5 border-b border-white/10 flex justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive ? 'bg-primary text-white shadow' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
