import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenu from './pages/admin/AdminMenu';

// Protect admin routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('chachu_admin_token');
  return token ? children : <Navigate to="/admin" replace />;
};

// Scroll to top on route/search change
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

// Customer layout wrapper
const CustomerLayout = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      {children}
      {/* Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-cafe-border flex md:hidden safe-bottom">
        <Link to="/" className="flex-1 flex flex-col items-center justify-center py-2 text-cafe-muted hover:text-primary transition-colors gap-0.5">
          <span className="text-lg">🏠</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/menu" className="flex-1 flex flex-col items-center justify-center py-2 text-cafe-muted hover:text-primary transition-colors gap-0.5">
          <span className="text-lg">🍽️</span>
          <span className="text-[10px] font-medium">Menu</span>
        </Link>
        <Link to="/track" className="flex-1 flex flex-col items-center justify-center py-2 text-cafe-muted hover:text-primary transition-colors gap-0.5">
          <span className="text-lg">📍</span>
          <span className="text-[10px] font-medium">Track</span>
        </Link>
        <button
          onClick={() => setCartOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-2 text-cafe-muted hover:text-primary transition-colors gap-0.5"
          id="mobile-cart-btn"
        >
          <span className="text-lg">🛒</span>
          <span className="text-[10px] font-medium">Cart</span>
        </button>
      </nav>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
          <Route path="/menu" element={<CustomerLayout><Menu /></CustomerLayout>} />
          <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
          <Route path="/order-confirmation/:id" element={<CustomerLayout><OrderConfirmation /></CustomerLayout>} />
          <Route path="/track" element={<CustomerLayout><TrackOrder /></CustomerLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute><AdminMenu /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
