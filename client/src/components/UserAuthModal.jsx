import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, Phone, Loader2, Sparkles } from 'lucide-react';
import tacoLogo from '../assets/taco-logo.png';

const UserAuthModal = () => {
  const {
    isUserAuthModalOpen,
    closeUserAuthModal,
    userAuthMode,
    setUserAuthMode,
    loginUser,
    registerUser,
  } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isUserAuthModalOpen) return null;

  const isLogin = userAuthMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await loginUser({ email: form.email, password: form.password });
      } else {
        await registerUser(form);
      }
    } catch {
      // toast is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    if (isLogin) {
      setForm({
        name: '',
        email: 'customer@tacotown.com',
        password: 'password123',
        phone: '',
      });
    } else {
      setForm({
        name: 'Aditya User',
        email: `user_${Date.now()}@tacotown.com`,
        password: 'password123',
        phone: '9876543210',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-cafe-border relative animate-scale-up"
        id="user-auth-modal"
      >
        {/* Close Button */}
        <button
          onClick={closeUserAuthModal}
          className="absolute top-4 right-4 p-2 text-cafe-muted hover:text-secondary hover:bg-cafe-bg rounded-full transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary to-primary-500 text-white p-6 text-center relative overflow-hidden">
          <img
            src={tacoLogo}
            alt="Taco Town Logo"
            className="w-14 h-14 object-contain mx-auto mb-2 bg-white p-1 rounded-2xl shadow-md"
          />
          <h2 className="font-display text-2xl font-bold">
            {isLogin ? 'Welcome Back! 👋' : 'Join Taco Town 🌮'}
          </h2>
          <p className="text-white/80 text-xs mt-1">
            {isLogin
              ? 'Sign in to access your saved details & track orders'
              : 'Create a customer account to order food instantly'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-cafe-border bg-cafe-bg">
          <button
            onClick={() => setUserAuthMode('login')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              isLogin
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'text-cafe-muted hover:text-secondary'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setUserAuthMode('register')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              !isLogin
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'text-cafe-muted hover:text-secondary'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-semibold text-cafe-text mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-cafe-text mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                className="input-field pl-10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-cafe-text mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-field pl-10 text-sm"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-semibold text-cafe-text mb-1 block">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210"
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : isLogin ? (
              'Sign In →'
            ) : (
              'Create Account →'
            )}
          </button>

          {/* Quick Demo Fill */}
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 px-3 bg-cafe-bg hover:bg-orange-50 text-cafe-text text-xs rounded-xl border border-cafe-border flex items-center justify-center gap-1.5 transition-colors font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Auto-fill Demo Credentials</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAuthModal;
