import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Loader2 } from 'lucide-react';
import { fetchOrder } from '../services/api';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter an Order ID');
      return;
    }

    setLoading(true);
    try {
      // Let's check if the order exists by fetching it
      // The endpoint /api/orders/:id supports finding by both _id and orderId
      const res = await fetchOrder(orderId.trim().toUpperCase());
      
      if (res.data.success) {
        // Redirect to the confirmation/tracking page
        navigate(`/order-confirmation/${res.data.data.orderId}`, { state: { order: res.data.data } });
      }
    } catch (err) {
      toast.error('Order not found. Please check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 bg-cafe-bg" id="track-order-page">
      <div className="card max-w-md w-full p-8 animate-fade-in text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="font-display text-2xl font-bold text-secondary mb-2">Track Your Order</h1>
        <p className="text-cafe-muted text-sm mb-8">
          Enter the Order ID you received when you placed your order (e.g., TTC-1001).
        </p>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cafe-muted" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. TTC-1001"
              className="w-full border-2 border-cafe-border rounded-xl pl-12 pr-4 py-3 text-secondary font-semibold focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
            id="track-submit-btn"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Searching...</>
            ) : (
              'Track Order →'
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default TrackOrder;
