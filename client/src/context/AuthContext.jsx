import { createContext, useContext, useState, useEffect } from 'react';
import { userLogin as apiUserLogin, userRegister as apiUserRegister, getUserProfile } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tacotown_user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tacotown_user_token') || null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false);
  const [userAuthMode, setUserAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (token && !user) {
      getUserProfile()
        .then((res) => {
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('tacotown_user_data', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          logoutUser();
        });
    }
  }, [token]);

  const loginUser = async (credentials) => {
    try {
      const res = await apiUserLogin(credentials);
      if (res.data?.success) {
        const { token: authToken, user: userData } = res.data;
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('tacotown_user_token', authToken);
        localStorage.setItem('tacotown_user_data', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}! 🌮`);
        setIsUserAuthModalOpen(false);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      throw err;
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await apiUserRegister(userData);
      if (res.data?.success) {
        const { token: authToken, user: newUser } = res.data;
        setToken(authToken);
        setUser(newUser);
        localStorage.setItem('tacotown_user_token', authToken);
        localStorage.setItem('tacotown_user_data', JSON.stringify(newUser));
        toast.success(`Account created! Welcome to Taco Town, ${newUser.name}! 🎉`);
        setIsUserAuthModalOpen(false);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      toast.error(msg);
      throw err;
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tacotown_user_token');
    localStorage.removeItem('tacotown_user_data');
    toast.success('Signed out successfully.');
  };

  const openRoleModal = () => setIsRoleModalOpen(true);
  const closeRoleModal = () => setIsRoleModalOpen(false);

  const openUserAuthModal = (mode = 'login') => {
    setUserAuthMode(mode);
    setIsUserAuthModalOpen(true);
  };
  const closeUserAuthModal = () => setIsUserAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginUser,
        registerUser,
        logoutUser,
        isRoleModalOpen,
        openRoleModal,
        closeRoleModal,
        isUserAuthModalOpen,
        openUserAuthModal,
        closeUserAuthModal,
        userAuthMode,
        setUserAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
