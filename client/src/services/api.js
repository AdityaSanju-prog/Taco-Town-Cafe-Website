import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Attach JWT token selectively (Admin token for admin routes, User token for user routes)
API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('chachu_admin_token');
  const userToken = localStorage.getItem('tacotown_user_token');

  // Admin routes get admin token
  if (config.url.includes('/admin') || (config.url.includes('/orders') && config.method !== 'post' && !config.url.includes('/user'))) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      return config;
    }
  }

  // User profile routes get user token
  if (config.url.includes('/user/me')) {
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  }

  // Generic admin authorization fallback if admin is logged in
  if (adminToken && !userToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

// Menu
export const fetchMenu = (category) =>
  API.get('/menu', { params: category ? { category } : {} });

// Admin Menu
export const fetchAdminMenu = () => API.get('/menu/admin/all');
export const createMenuItem = (data) => API.post('/menu', data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

// Orders
export const placeOrder = (orderData) => API.post('/orders', orderData);
export const fetchOrders = () => API.get('/orders');
export const fetchOrder = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}`, { status });
export const fetchStats = () => API.get('/orders/stats');

// User Auth
export const userRegister = (userData) => API.post('/user/register', userData);
export const userLogin = (credentials) => API.post('/user/login', credentials);
export const getUserProfile = () => API.get('/user/me');

// Admin Auth
export const adminLogin = (credentials) =>
  API.post('/admin/login', credentials);

export default API;
