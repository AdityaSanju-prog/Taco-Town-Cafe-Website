import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, totalItems, totalAmount, updateQuantity, removeItem } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="cart-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-cafe-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-lg text-secondary">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cafe-bg transition-colors"
            id="close-cart-btn"
          >
            <X className="w-5 h-5 text-cafe-muted" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-20 h-20 bg-cafe-bg rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-cafe-border" />
              </div>
              <div>
                <p className="font-display font-semibold text-secondary">Your cart is empty</p>
                <p className="text-cafe-muted text-sm mt-1">Add some items from the menu!</p>
              </div>
              <button
                onClick={onClose}
                className="btn-primary text-sm py-2 px-5"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="flex items-center gap-3 bg-cafe-bg rounded-xl p-3 animate-fade-in">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-secondary text-sm truncate">{item.name}</p>
                  <p className="text-primary font-bold text-sm">₹{item.price * item.quantity}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-cafe-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-cafe-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="w-7 h-7 flex items-center justify-center ml-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cafe-border p-4 space-y-3 safe-bottom bg-white shadow-float">
            <div className="flex justify-between items-center">
              <span className="text-cafe-muted font-medium">Subtotal</span>
              <span className="font-display font-bold text-xl text-secondary">₹{totalAmount}</span>
            </div>
            <p className="text-xs text-cafe-muted text-center">🛵 Free delivery within Lowgate campus</p>
            <Link
              to="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center block"
              id="checkout-btn"
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
