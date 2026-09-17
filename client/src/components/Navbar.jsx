import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import tacoLogo from '../assets/taco-logo.png';

const Navbar = ({ onCartOpen }) => {
  const { totalItems } = useCart();
  const { user, logoutUser, openRoleModal, openUserAuthModal } = useAuth();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
          {/* User / Portal Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-cafe-bg hover:bg-orange-50 border border-cafe-border text-secondary px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                id="user-profile-btn"
              >
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-cafe-muted" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-cafe-border p-2 z-50 animate-scale-up">
                  <div className="px-3 py-2 border-b border-cafe-border mb-1">
                    <p className="text-xs font-bold text-secondary truncate">{user.name}</p>
                    <p className="text-[10px] text-cafe-muted truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      openRoleModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-cafe-text hover:bg-cafe-bg rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Switch Role / Portal
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logoutUser();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openRoleModal}
              className="flex items-center gap-1.5 bg-secondary text-white hover:bg-secondary-light px-3 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm"
              id="portal-btn"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Portal / Sign In</span>
            </button>
          )}

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
