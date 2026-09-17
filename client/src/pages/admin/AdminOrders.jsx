import { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCw, Loader2, ChevronDown, Phone, MapPin } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

const STATUS_OPTIONS = ['Pending', 'Preparing', 'Delivered', 'Cancelled'];

const getBadgeClass = (status) => {
  if (status === 'Pending') return 'badge-pending';
  if (status === 'Preparing') return 'badge-preparing';
  if (status === 'Cancelled') return 'bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full text-xs';
  return 'badge-delivered';
};

const FALLBACK_ORDERS = [
  {
    _id: 'ord_1',
    orderId: 'TT-8921',
    customer: { name: 'Aditya Sanju', phone: '9876543210', hostel: 'BH-1 (Boys Hostel 1)', address: 'Room 304, Block A' },
    items: [
      { name: 'Crispy Veg Taco (2 pcs)', price: 79, quantity: 2 },
      { name: 'Masala Chai', price: 15, quantity: 1 }
    ],
    totalAmount: 173,
    status: 'Pending',
    paymentMethod: 'COD',
    createdAt: new Date().toISOString()
  }
];

const AdminOrders = () => {
  const [orders, setOrders] = useState(FALLBACK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetchOrders();
      const ordersList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      if (ordersList && ordersList.length > 0) {
        setOrders(ordersList);
      }
    } catch (err) {
      console.warn('Using fallback order list:', err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => {
      loadOrders(false);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    // Optimistic local UI update
    setOrders(prev =>
      prev.map(o => (o._id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o)
    );

    try {
      const res = await updateOrderStatus(orderId, newStatus);
      const updatedOrder = res.data?.data || res.data;
      if (updatedOrder && updatedOrder.status) {
        setOrders(prev =>
          prev.map(o => (o._id === orderId || o.orderId === orderId) ? { ...o, ...updatedOrder } : o)
        );
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Status update error:', err);
      toast.error(err.response?.data?.message || 'Failed to sync status update with server');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout title="Orders">
      {/* Top Header */}
      <div className="bg-white border-b border-cafe-border px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display font-bold text-lg md:text-xl text-secondary">Order Management</h1>
          <p className="text-cafe-muted text-xs">Live customer incoming orders</p>
        </div>
        <button
          onClick={() => loadOrders(true)}
          className="p-2 rounded-lg hover:bg-cafe-bg transition-colors text-cafe-muted hover:text-secondary flex items-center gap-1.5 text-xs font-semibold"
          title="Refresh orders"
          id="refresh-orders-btn"
        >
          <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="p-4 md:p-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {['All', ...STATUS_OPTIONS].map(f => {
            const count = f === 'All' ? orders.length : orders.filter(o => o.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                id={`filter-${f.toLowerCase()}`}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === f
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-cafe-muted border border-cafe-border hover:border-primary'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Orders List */}
        {!loading && (
          <>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-cafe-border p-8">
                <ShoppingBag className="w-12 h-12 text-cafe-border mx-auto mb-3" />
                <p className="font-display font-bold text-secondary text-base">No orders found</p>
                <p className="text-cafe-muted text-xs mt-1">Orders placed by customers will appear here instantly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOrders.map(order => (
                  <div key={order._id || order.orderId} className="card p-5 animate-fade-in hover:shadow-card-hover transition-shadow flex flex-col justify-between">
                    <div>
                      {/* Order Header */}
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-bold text-primary text-base md:text-lg">{order.orderId}</span>
                            <span className={getBadgeClass(order.status)}>{order.status}</span>
                          </div>
                          <p className="text-cafe-muted text-[11px] mt-0.5">
                            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>

                        {/* Status Update Selector */}
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => handleStatusUpdate(order._id || order.orderId, e.target.value)}
                            disabled={updatingId === (order._id || order.orderId)}
                            className="appearance-none border border-cafe-border rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:border-primary transition-colors disabled:opacity-50"
                            id={`status-select-${order._id || order.orderId}`}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cafe-muted pointer-events-none" />
                          {updatingId === (order._id || order.orderId) && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="bg-cafe-bg rounded-xl p-3 mb-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-secondary text-xs">{order.customer?.name || 'Guest Customer'}</p>
                          {order.customer?.hostel && (
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20">
                              {order.customer.hostel}
                            </span>
                          )}
                        </div>
                        <p className="text-cafe-muted text-xs flex items-center gap-2 flex-wrap">
                          <a href={`tel:${order.customer?.phone}`} className="hover:text-primary flex items-center gap-1 font-medium">
                            <Phone className="w-3 h-3 text-primary" /> {order.customer?.phone}
                          </a>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {order.customer?.address}
                          </span>
                        </p>
                      </div>

                      {/* Items */}
                      <div className="space-y-1 mb-4 bg-white/50 p-2 rounded-lg">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-cafe-text font-medium">{item.name} <span className="text-cafe-muted">× {item.quantity}</span></span>
                            <span className="font-semibold text-secondary">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer / Total */}
                    <div className="border-t border-cafe-border pt-2.5 flex justify-between items-center mt-auto">
                      <span className="text-cafe-muted text-xs font-medium">Payment Mode: <strong className="text-secondary">{order.paymentMethod || 'COD'}</strong></span>
                      <span className="font-display font-bold text-primary text-base">₹{order.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
