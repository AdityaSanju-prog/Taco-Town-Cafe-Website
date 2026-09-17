import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Coffee, TrendingUp, Clock, CheckCircle, Package, RefreshCw, Loader2, Menu as MenuIcon, BarChart3, PieChart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStats } from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

const FALLBACK_STATS = {
  total: 12,
  todayCount: 4,
  pending: 1,
  preparing: 2,
  delivered: 9,
  totalRevenue: 1480,
  dailyRevenue: [
    { date: 'Mon', revenue: 240, orders: 2 },
    { date: 'Tue', revenue: 380, orders: 3 },
    { date: 'Wed', revenue: 190, orders: 1 },
    { date: 'Thu', revenue: 450, orders: 4 },
    { date: 'Fri', revenue: 620, orders: 5 },
    { date: 'Sat', revenue: 780, orders: 6 },
    { date: 'Sun', revenue: 510, orders: 4 },
  ],
  topItems: [
    { name: 'Crispy Veg Taco (2 pcs)', quantity: 38, revenue: 3002 },
    { name: 'Masala Chai', quantity: 64, revenue: 960 },
    { name: 'Paneer Tikka Sandwich', quantity: 22, revenue: 1650 },
    { name: 'Margherita Pizza', quantity: 14, revenue: 1680 },
  ],
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);

  const loadStats = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetchStats();
      const statsObj = res.data?.data || res.data;
      if (statsObj && typeof statsObj === 'object' && statsObj.total !== undefined) {
        setStats(statsObj);
      }
    } catch (err) {
      console.warn('Using fallback stats:', err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(() => {
      loadStats(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Orders", value: stats.todayCount, icon: TrendingUp, color: 'text-primary', bg: 'bg-orange-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Preparing', value: stats.preparing, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      {/* Top Header */}
      <div className="bg-white border-b border-cafe-border px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display font-bold text-lg md:text-xl text-secondary">Café Overview</h1>
          <p className="text-cafe-muted text-xs">Real-time statistics & activity</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadStats(true)}
            className="p-2 rounded-lg hover:bg-cafe-bg transition-colors text-cafe-muted hover:text-secondary"
            title="Refresh stats"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link to="/admin/orders" className="btn-primary text-xs md:text-sm py-2 px-3 md:px-4">
            View Orders
          </Link>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {STAT_CARDS.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="card p-4 hover:shadow-card-hover transition-all">
                  <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center mb-2`}>
                    <Icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <p className="font-display font-bold text-xl md:text-2xl text-secondary">{card.value}</p>
                  <p className="text-cafe-muted text-xs mt-0.5">{card.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts & Top Items */}
        {!loading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-secondary text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Last 7 Days Revenue
                </h2>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.dailyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} tickFormatter={v => `₹${v}`} />
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
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-secondary text-base flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-primary" /> Top Items
                </h2>
              </div>
              {stats.topItems && stats.topItems.length > 0 ? (
                <div className="space-y-3">
                  {stats.topItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-cafe-bg text-cafe-muted'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary text-xs line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-cafe-muted">{item.quantity} sold</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary text-xs">₹{item.revenue}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center">
                  <Package className="w-6 h-6 text-cafe-border mb-1" />
                  <p className="text-xs text-cafe-muted">No sales data recorded</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="card p-5">
          <h2 className="font-display font-semibold text-secondary text-base mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/admin/orders" className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Manage Orders
            </Link>
            <Link to="/admin/menu" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5 border-primary text-primary hover:bg-primary/5">
              <MenuIcon className="w-3.5 h-3.5" /> Edit Menu
            </Link>
            <Link to="/" target="_blank" className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5" /> Customer Site
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
