import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Attach Admin JWT token ONLY for staff / admin routes
API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('chachu_admin_token');

  // Check if request is an admin route
  const isAdminRoute =
    config.url.includes('/admin') ||
    config.url.includes('/menu/admin') ||
    (config.url === '/orders' && config.method === 'get') ||
    (config.url.startsWith('/orders/') && config.method === 'put') ||
    config.url === '/orders/stats';

  if (isAdminRoute && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

// Public Customer Menu (No auth needed)
export const fetchMenu = (category) =>
  API.get('/menu', { params: category ? { category } : {} });

// Admin Menu Management
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

// Admin Auth
export const adminLogin = (credentials) =>
  API.post('/admin/login', credentials);

export default API;
