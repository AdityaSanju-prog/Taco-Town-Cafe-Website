import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, X, ChevronRight, Utensils, LayoutDashboard } from 'lucide-react';
import tacoLogo from '../assets/taco-logo.png';

const RoleSelectorModal = () => {
  const { isRoleModalOpen, closeRoleModal, openUserAuthModal, user } = useAuth();
  const navigate = useNavigate();

  if (!isRoleModalOpen) return null;

  const handleSelectUser = () => {
    closeRoleModal();
    if (user) {
      navigate('/menu');
    } else {
      openUserAuthModal('login');
    }
  };

  const handleSelectAdmin = () => {
    closeRoleModal();
    navigate('/admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-cafe-border relative animate-scale-up"
        id="role-selector-modal"
      >
        {/* Close button */}
        <button
          onClick={closeRoleModal}
          className="absolute top-4 right-4 p-2 text-cafe-muted hover:text-secondary hover:bg-cafe-bg rounded-full transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-secondary via-secondary-light to-primary text-white p-6 pt-8 text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          <img
            src={tacoLogo}
            alt="Taco Town Logo"
            className="w-16 h-16 object-contain mx-auto mb-3 bg-white p-1.5 rounded-2xl shadow-lg ring-4 ring-white/20"
          />
          <h2 className="font-display text-2xl font-bold">Welcome to Taco Town! 🌮</h2>
          <p className="text-white/80 text-xs mt-1 max-w-xs mx-auto">
            Choose how you would like to sign in & access the platform
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          {/* Option 1: Customer / User Panel */}
          <button
            onClick={handleSelectUser}
            className="w-full text-left p-4 rounded-2xl border-2 border-primary/20 hover:border-primary bg-orange-50/50 hover:bg-orange-50 transition-all group flex items-center gap-4 relative overflow-hidden shadow-sm hover:shadow-md"
            id="role-select-user"
          >
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform shadow-md shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-secondary text-base group-hover:text-primary transition-colors">
                  Customer / User Panel
                </span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                  Food & Orders
                </span>
              </div>
              <p className="text-xs text-cafe-muted mt-0.5">
                {user ? `Logged in as ${user.name}` : 'Order delicious tacos, customize items & track status'}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-cafe-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </button>

          {/* Option 2: Admin Panel */}
          <button
            onClick={handleSelectAdmin}
            className="w-full text-left p-4 rounded-2xl border-2 border-secondary/20 hover:border-secondary bg-slate-50/80 hover:bg-slate-100 transition-all group flex items-center gap-4 relative overflow-hidden shadow-sm hover:shadow-md"
            id="role-select-admin"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-secondary text-base group-hover:text-accent transition-colors">
                  Admin Panel
                </span>
                <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-semibold">
                  Staff Only
                </span>
              </div>
              <p className="text-xs text-cafe-muted mt-0.5">
                Manage orders, menu items, sales analytics & live status
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-cafe-muted group-hover:text-secondary group-hover:translate-x-1 transition-all shrink-0" />
          </button>
        </div>

        {/* Footer info */}
        <div className="px-6 pb-6 text-center">
          <p className="text-[11px] text-cafe-muted">
            Café Management & Ordering System · Taco Town Unimall 6th Floor
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectorModal;
