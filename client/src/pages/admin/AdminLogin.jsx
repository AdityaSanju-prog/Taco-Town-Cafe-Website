import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { adminLogin } from '../../services/api';
import toast from 'react-hot-toast';
import tacoLogo from '../../assets/taco-logo.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('chachu_admin_token')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Please enter admin credentials');
      return;
    }
    setLoading(true);
    try {
      const res = await adminLogin(form);
      localStorage.setItem('chachu_admin_token', res.data.token);
      toast.success('Welcome back, Admin! 👋');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid admin credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary via-secondary-light to-secondary-lighter flex items-center justify-center p-4" id="admin-login-page">
      <div className="w-full max-w-sm">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-white/70 hover:text-white mb-4 text-xs transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Website
        </Link>

        {/* Header / Logo */}
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <div className="relative">
            <img
              src={tacoLogo}
              alt="Taco Town Logo"
              className="w-16 h-16 object-contain rounded-2xl shadow-lg bg-white p-1 ring-4 ring-white/10"
            />
            <div className="absolute -bottom-1 -right-1 bg-accent text-secondary p-1 rounded-full shadow-md">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Taco Town Admin</h1>
          <p className="text-gray-400 text-xs">Secure Staff & Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="font-display font-bold text-xl text-secondary mb-5">Admin Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4" id="admin-login-form">
            <div>
              <label className="text-xs font-semibold text-cafe-text mb-1 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
                <input
                  type="text"
                  id="admin-username"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="Enter Admin Username"
                  className="input-field pl-10 text-sm"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-cafe-text mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cafe-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter Admin Password"
                  className="input-field pl-10 pr-10 text-sm"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cafe-muted hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold shadow-md"
              id="admin-login-btn"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
              ) : (
                'Secure Sign In →'
              )}
            </button>
          </form>

          <p className="text-[11px] text-cafe-muted text-center mt-4">
            🔒 Protected Area · Unauthorized Access is Restricted
          </p>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
