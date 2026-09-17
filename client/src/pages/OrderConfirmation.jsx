import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, Truck, Copy, Home } from 'lucide-react';
import { fetchOrder } from '../services/api';

const STATUS_STEPS = ['Pending', 'Preparing', 'Delivered'];
const STATUS_ICONS = {
  Pending: Clock,
  Preparing: Package,
  Delivered: Truck,
};

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!order && id) {
      setLoading(true);
      fetchOrder(id)
        .then(res => setOrder(res.data.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cafe-muted">Loading your order...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="font-display font-bold text-2xl text-secondary mb-2">Order Not Found</h2>
        <Link to="/" className="btn-primary mt-4">Go Home</Link>
      </main>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 pb-20 animate-slide-up" id="confirmation-page">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-once">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-secondary">Order Placed! 🎉</h1>
        <p className="text-cafe-muted mt-2">Your order is confirmed. We'll deliver it soon!</p>
      </div>

      {/* Order ID */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cafe-muted text-xs font-medium uppercase tracking-wide">Order ID</p>
            <p className="font-display font-bold text-2xl text-primary mt-1">{order.orderId}</p>
          </div>
          <button
            onClick={copyOrderId}
            className="flex items-center gap-1.5 text-sm text-cafe-muted hover:text-primary transition-colors border border-cafe-border px-3 py-2 rounded-lg hover:border-primary"
            id="copy-order-id-btn"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-cafe-muted text-xs mt-3">
          Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium', timeStyle: 'short'
          })}
        </p>
      </div>

      {/* Status Tracker */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-secondary mb-4">Order Status</h2>
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-cafe-border" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
            style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
          />
          {STATUS_STEPS.map((step, idx) => {
            const Icon = STATUS_ICONS[step];
            const active = idx <= currentStep;
            return (
              <div key={step} className="flex flex-col items-center relative z-10 gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  active ? 'bg-primary text-white shadow-md' : 'bg-cafe-bg border-2 border-cafe-border text-cafe-muted'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-cafe-muted'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-secondary mb-3">Delivery Details</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-cafe-muted">Name</span>
            <span className="font-medium text-secondary">{order.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cafe-muted">Phone</span>
            <span className="font-medium text-secondary">{order.customer.phone}</span>
          </div>
          {order.customer.hostel && (
            <div className="flex justify-between">
              <span className="text-cafe-muted">Hostel / Building</span>
              <span className="font-semibold text-primary">{order.customer.hostel}</span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-cafe-muted flex-shrink-0">Room / Address</span>
            <span className="font-medium text-secondary text-right">{order.customer.address}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-secondary mb-3">Items Ordered</h2>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-cafe-text">{item.name} <span className="text-cafe-muted">× {item.quantity}</span></span>
              <span className="font-semibold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-cafe-border mt-3 pt-3 flex justify-between">
          <span className="font-semibold text-secondary">Total</span>
          <span className="font-display font-bold text-primary text-lg">₹{order.totalAmount}</span>
        </div>
        <p className="text-xs text-cafe-muted mt-2">Payment: Cash on Delivery 💵</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to="/menu" className="btn-outline flex-1 text-center text-sm py-2.5" id="order-more-btn">
          Order More
        </Link>
        <Link to="/" className="btn-primary flex-1 text-center text-sm py-2.5 flex items-center justify-center gap-2" id="go-home-btn">
          <Home className="w-4 h-4" /> Home
        </Link>
      </div>
    </main>
  );
};

export default OrderConfirmation;
