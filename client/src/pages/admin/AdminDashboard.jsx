import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, LogOut, Coffee,
  TrendingUp, Clock, CheckCircle, Package, RefreshCw, Loader2, Menu as MenuIcon, BarChart3, PieChart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchStats } from '../../services/api';
import tacoLogo from '../../assets/taco-logo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetchStats();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load stats');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => { 
    loadStats(); 
    // Auto-refresh stats every 5 seconds to keep charts and numbers live
    const interval = setInterval(() => {
      loadStats(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('chachu_admin_token');
    toast.success('Logged out');
    navigate('/admin');
  };

  const STAT_CARDS = stats ? [
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Orders", value: stats.todayCount, icon: TrendingUp, color: 'text-primary', bg: 'bg-orange-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Preparing', value: stats.preparing, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [];

  return (
    <div className="min-h-screen bg-cafe-bg flex" id="admin-dashboard">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 bg-secondary flex-col fixed h-full z-20">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src={tacoLogo}
              alt="Taco Town Logo"
              className="w-8 h-8 object-contain rounded-lg bg-white p-0.5"
            />
            <div>
              <p className="font-display font-bold text-white text-sm">Taco Town Admin</p>
              <p className="text-gray-400 text-xs">Café Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-primary/20 text-primary rounded-xl font-medium text-sm">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-medium text-sm transition-all">
            <ShoppingBag className="w-4 h-4" /> Orders
          </Link>
          <Link to="/admin/menu" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-medium text-sm transition-all">
            <MenuIcon className="w-4 h-4" /> Menu
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-medium text-sm transition-all w-full"
            id="logout-btn"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-56">
        {/* Top Bar */}
        <div className="bg-white border-b border-cafe-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-display font-bold text-xl text-secondary">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={loadStats}
              className="p-2 rounded-lg hover:bg-cafe-bg transition-colors text-cafe-muted hover:text-secondary"
              title="Refresh stats"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link to="/admin/orders" className="btn-primary text-sm py-2 px-4" id="view-orders-btn">
              View Orders
            </Link>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {STAT_CARDS.map(card => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="card p-5 hover:shadow-card-hover transition-shadow animate-fade-in">
                    <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <p className="font-display font-bold text-2xl text-secondary">{card.value}</p>
                    <p className="text-cafe-muted text-sm mt-0.5">{card.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Charts Section */}
          {!loading && stats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="card p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-secondary text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" /> Last 7 Days Revenue
                  </h2>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={v => `₹${v}`} width={60} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                        formatter={(value, name) => [name === 'revenue' ? `₹${value}` : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Selling Items */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-secondary text-lg flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" /> Top Selling Items
                  </h2>
                </div>
                {stats.topItems && stats.topItems.length > 0 ? (
                  <div className="space-y-4">
                    {stats.topItems.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-cafe-bg text-cafe-muted'
                          }`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-secondary text-sm line-clamp-1">{item.name}</p>
                            <p className="text-xs text-cafe-muted">{item.quantity} units sold</p>
                          </div>
                        </div>
                        <p className="font-bold text-primary text-sm">₹{item.revenue}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center">
                    <Package className="w-8 h-8 text-cafe-border mb-2" />
                    <p className="text-sm text-cafe-muted">Not enough data yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-secondary text-lg mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/orders" className="btn-primary text-sm py-2.5 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Manage Orders
              </Link>
              <Link to="/admin/menu" className="btn-outline text-sm py-2.5 flex items-center gap-2 border-primary text-primary hover:bg-primary/5">
                <MenuIcon className="w-4 h-4" /> Edit Menu
              </Link>
              <Link to="/" target="_blank" className="btn-outline text-sm py-2.5 flex items-center gap-2">
                <Coffee className="w-4 h-4" /> View Customer Site
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
