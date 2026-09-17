import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Building, Banknote, Loader2, ChevronLeft, Tag, Check, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';
import toast from 'react-hot-toast';

const HOSTEL_OPTIONS = [
  // Boys Hostels (1 to 13)
  'BH-1 (Boys Hostel 1)',
  'BH-2 (Boys Hostel 2)',
  'BH-3 (Boys Hostel 3)',
  'BH-4 (Boys Hostel 4)',
  'BH-5 (Boys Hostel 5)',
  'BH-6 (Boys Hostel 6)',
  'BH-7 (Boys Hostel 7)',
  'BH-8 (Boys Hostel 8)',
  'BH-9 (Boys Hostel 9)',
  'BH-10 (Boys Hostel 10)',
  'BH-11 (Boys Hostel 11)',
  'BH-12 (Boys Hostel 12)',
  'BH-13 (Boys Hostel 13)',
  // Girls Hostels (1 to 12)
  'GH-1 (Girls Hostel 1)',
  'GH-2 (Girls Hostel 2)',
  'GH-3 (Girls Hostel 3)',
  'GH-4 (Girls Hostel 4)',
  'GH-5 (Girls Hostel 5)',
  'GH-6 (Girls Hostel 6)',
  'GH-7 (Girls Hostel 7)',
  'GH-8 (Girls Hostel 8)',
  'GH-9 (Girls Hostel 9)',
  'GH-10 (Girls Hostel 10)',
  'GH-11 (Girls Hostel 11)',
  'GH-12 (Girls Hostel 12)',
  // Other Locations
  'Unimall 6th Floor (Counter Pickup)',
  'Staff Quarters',
  'Other LPU Block / Hostel',
];

const VALID_COUPONS = {
  TACO20: { type: 'percent', value: 20, desc: '20% OFF on order' },
  LPUMALL149: { type: 'flat', value: 30, minOrder: 149, desc: '₹30 OFF on orders > ₹149' },
  HOSTELFREE: { type: 'flat', value: 20, desc: 'Free Delivery (₹20 OFF)' },
  WELCOME10: { type: 'percent', value: 10, desc: '10% OFF on order' },
};

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    hostel: '',
    customHostel: '',
    address: '',
  });
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Discount calculation
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const deal = VALID_COUPONS[appliedCoupon];
    if (!deal) return 0;
    if (deal.minOrder && totalAmount < deal.minOrder) return 0;
    if (deal.type === 'percent') {
      return Math.round((totalAmount * deal.value) / 100);
    }
    if (deal.type === 'flat') {
      return Math.min(totalAmount, deal.value);
    }
    return 0;
  };

  const discountAmount = calculateDiscount();
  const finalTotalAmount = Math.max(0, totalAmount - discountAmount);

  const handleApplyCoupon = (codeToApply) => {
    const code = (typeof codeToApply === 'string' ? codeToApply : couponInput).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a promo code');
      return;
    }
    const coupon = VALID_COUPONS[code];
    if (!coupon) {
      toast.error(`Invalid code "${code}". Try TACO20 or HOSTELFREE!`);
      return;
    }
    if (coupon.minOrder && totalAmount < coupon.minOrder) {
      toast.error(`Minimum order amount of ₹${coupon.minOrder} required for ${code}`);
      return;
    }
    setAppliedCoupon(code);
    setCouponInput('');
    toast.success(`Coupon "${code}" applied successfully! 🎉`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit contact number';
    }
    const finalHostel = form.hostel === 'Other LPU Block / Hostel' ? form.customHostel : form.hostel;
    if (!finalHostel || !finalHostel.trim()) {
      newErrors.hostel = 'Hostel / Building Name is required';
    }
    if (!form.address.trim()) {
      newErrors.address = 'Please enter your room number or address details';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    setLoading(true);

    const selectedHostelName = form.hostel === 'Other LPU Block / Hostel' ? form.customHostel.trim() : form.hostel;

    try {
      const orderData = {
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          hostel: selectedHostelName,
          address: form.address.trim(),
        },
        items: items.map(i => {
          const itemPayload = {
            name: i.name,
            price: Number(i.price),
            quantity: Number(i.quantity),
          };
          if (i._id && typeof i._id === 'string' && /^[0-9a-fA-F]{24}$/.test(i._id)) {
            itemPayload.menuItem = i._id;
          }
          return itemPayload;
        }),
        totalAmount: Number(finalTotalAmount),
        coupon: appliedCoupon ? { code: appliedCoupon, discount: discountAmount } : null,
        paymentMethod: 'COD',
      };
      const res = await placeOrder(orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      const orderObj = res.data?.data || res.data;
      const orderId = orderObj?.orderId || orderObj?._id || 'TT-ORDER';
      navigate(`/order-confirmation/${orderId}`, { state: { order: orderObj } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
      console.error('Order placement error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="font-display font-bold text-2xl text-secondary mb-2">Cart is Empty</h2>
        <p className="text-cafe-muted mb-6">Add items from the menu before checkout.</p>
        <button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-20" id="checkout-page">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-cafe-muted hover:text-secondary mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="font-display text-2xl font-bold text-secondary mb-4">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="checkout-form">
          <div className="card p-5 space-y-4">
            <h2 className="font-display font-semibold text-secondary text-lg">Customer & Delivery Details</h2>

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-cafe-text mb-1 block">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
                <input
                  type="text"
                  name="name"
                  id="input-name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`input-field pl-10 ${errors.name ? 'ring-2 ring-red-400 border-red-400' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-cafe-text mb-1 block">Contact Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
                <input
                  type="tel"
                  name="phone"
                  id="input-phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`input-field pl-10 ${errors.phone ? 'ring-2 ring-red-400 border-red-400' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Hostel Name */}
            <div>
              <label className="text-sm font-medium text-cafe-text mb-1 block">Hostel Name / Building <span className="text-red-500">*</span></label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted pointer-events-none" />
                <select
                  name="hostel"
                  id="input-hostel"
                  value={form.hostel}
                  onChange={handleChange}
                  className={`input-field pl-10 bg-white ${errors.hostel ? 'ring-2 ring-red-400 border-red-400' : ''}`}
                >
                  <option value="">-- Select Hostel / Location --</option>
                  {HOSTEL_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {form.hostel === 'Other LPU Block / Hostel' && (
                <input
                  type="text"
                  name="customHostel"
                  id="input-custom-hostel"
                  value={form.customHostel}
                  onChange={handleChange}
                  placeholder="Enter your Hostel / Block name"
                  className="input-field mt-2"
                />
              )}
              {errors.hostel && <p className="text-red-500 text-xs mt-1">{errors.hostel}</p>}
            </div>

            {/* Address Details */}
            <div>
              <label className="text-sm font-medium text-cafe-text mb-1 block">Room No. & Block Details <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-cafe-muted" />
                <textarea
                  name="address"
                  id="input-address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. Room 304, 3rd Floor, Block A..."
                  rows={2}
                  className={`input-field pl-10 resize-none ${errors.address ? 'ring-2 ring-red-400 border-red-400' : ''}`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Payment */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
              <Banknote className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800 text-sm">Cash on Delivery</p>
                <p className="text-green-600 text-xs">Pay cash or UPI upon hostel delivery.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
            id="place-order-btn"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
            ) : (
              `Place Order · ₹${finalTotalAmount}`
            )}
          </button>
        </form>

        {/* Order Summary & Coupon Section */}
        <div className="card p-5 h-fit space-y-4">
          <h2 className="font-display font-semibold text-secondary text-lg">Order Summary</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item._id} className="flex justify-between items-center text-sm">
                <span className="text-cafe-text">
                  {item.name} <span className="text-cafe-muted">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-secondary">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* 🎟️ Coupon Section */}
          <div className="pt-3 border-t border-cafe-border">
            <label className="text-xs font-bold uppercase tracking-wider text-cafe-muted mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-primary" /> Apply Promo Code / Coupon
            </label>
            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between animate-fade-in">
                <div>
                  <p className="font-bold text-green-800 text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-green-600" /> Coupon '{appliedCoupon}' Applied
                  </p>
                  <p className="text-green-700 text-xs mt-0.5 font-medium">You saved ₹{discountAmount} on this order!</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Coupon"
                  id="remove-coupon-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. TACO20)"
                    className="input-field py-2 text-sm uppercase flex-1"
                    id="input-coupon"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1"
                    id="apply-coupon-btn"
                  >
                    Apply
                  </button>
                </div>
                {/* Quick Apply Promo Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['TACO20', 'LPUMALL149', 'HOSTELFREE'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleApplyCoupon(code)}
                      className="text-[11px] font-semibold bg-cafe-bg hover:bg-primary/10 hover:text-primary text-cafe-muted px-2.5 py-1 rounded-lg border border-cafe-border transition-colors flex items-center gap-1"
                    >
                      <span>🏷️</span> {code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-cafe-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-cafe-muted">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount ({appliedCoupon})</span>
                <span>- ₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-cafe-border">
              <span className="font-semibold text-secondary">Total Payable</span>
              <span className="font-display font-bold text-xl text-primary">₹{finalTotalAmount}</span>
            </div>
          </div>
          <p className="text-xs text-cafe-muted mt-2 text-center">🛵 Free delivery · COD only</p>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
