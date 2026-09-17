import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, LogOut, Coffee,
  Clock, Package, CheckCircle, RefreshCw, Loader2, AlertCircle, ChevronDown, Menu as MenuIcon
} from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import tacoLogo from '../../assets/taco-logo.png';

const STATUS_OPTIONS = ['Pending', 'Preparing', 'Delivered'];

const getBadgeClass = (status) => {
  if (status === 'Pending') return 'badge-pending';
  if (status === 'Preparing') return 'badge-preparing';
  return 'badge-delivered';
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetchOrders();
      setOrders(res.data.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => { 
    loadOrders(); 
    // Auto-refresh orders every 5 seconds
    const interval = setInterval(() => {
      loadOrders(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chachu_admin_token');
    navigate('/admin');
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-cafe-bg flex" id="admin-orders-page">
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
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-medium text-sm transition-all">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 bg-primary/20 text-primary rounded-xl font-medium text-sm">
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
          <h1 className="font-display font-bold text-xl text-secondary">Orders</h1>
          <button
            onClick={loadOrders}
            className="p-2 rounded-lg hover:bg-cafe-bg transition-colors text-cafe-muted hover:text-secondary"
            title="Refresh"
            id="refresh-orders-btn"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
            {['All', ...STATUS_OPTIONS].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                id={`filter-${f.toLowerCase()}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === f ? 'bg-primary text-white shadow-md' : 'bg-white text-cafe-muted border border-cafe-border hover:border-primary'
                }`}
              >
                {f} {f !== 'All' && `(${orders.filter(o => o.status === f).length})`}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          )}

          {/* Orders List */}
          {!loading && (
            <>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-12 h-12 text-cafe-border mx-auto mb-3" />
                  <p className="font-semibold text-secondary">No orders found</p>
                  <p className="text-cafe-muted text-sm mt-1">Orders will appear here as customers place them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div key={order._id} className="card p-5 animate-fade-in hover:shadow-card-hover transition-shadow">
                      {/* Order Header */}
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-bold text-primary text-lg">{order.orderId}</span>
                            <span className={getBadgeClass(order.status)}>{order.status}</span>
                          </div>
                          <p className="text-cafe-muted text-xs mt-1">
                            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                        {/* Status Update Dropdown */}
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className="appearance-none border border-cafe-border rounded-xl px-3 py-2 pr-8 text-sm font-semibold text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:border-primary transition-colors disabled:opacity-50"
                            id={`status-select-${order._id}`}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted pointer-events-none" />
                          {updatingId === order._id && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customer */}
                      <div className="bg-cafe-bg rounded-xl p-3 mb-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-secondary text-sm">{order.customer.name}</p>
                          {order.customer.hostel && (
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-md border border-primary/20">
                              {order.customer.hostel}
                            </span>
                          )}
                        </div>
                        <p className="text-cafe-muted text-xs">📞 {order.customer.phone} · 📍 {order.customer.address}</p>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-cafe-text">{item.name} <span className="text-cafe-muted">× {item.quantity}</span></span>
                            <span className="font-medium">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t border-cafe-border pt-3 flex justify-between items-center">
                        <span className="text-cafe-muted text-sm">Total · COD</span>
                        <span className="font-display font-bold text-primary text-lg">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
