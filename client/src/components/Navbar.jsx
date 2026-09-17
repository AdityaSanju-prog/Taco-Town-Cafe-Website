import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import tacoLogo from '../assets/taco-logo.png';

const Navbar = ({ onCartOpen }) => {
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-cafe-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={tacoLogo}
            alt="Taco Town Logo"
            className="w-10 h-10 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="font-display font-bold text-lg text-secondary leading-none block">Taco Town</span>
            <span className="text-[10px] text-cafe-muted font-medium leading-none">Café · Unimall 6th Floor, LPU</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={`nav-link ${isActive('/') ? 'text-primary font-semibold' : ''}`}>Home</Link>
          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'text-primary font-semibold' : ''}`}>Menu</Link>
          <Link to="/track" className={`nav-link ${isActive('/track') ? 'text-primary font-semibold' : ''}`}>Track Order</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Admin Staff Portal Link */}
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-1.5 bg-cafe-bg hover:bg-orange-50 border border-cafe-border text-secondary px-3 py-1.5 rounded-xl font-semibold text-xs transition-all"
            id="admin-portal-link"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Staff Login</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-500 active:scale-95 transition-all shadow-md"
            id="cart-btn"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-secondary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-subtle">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
