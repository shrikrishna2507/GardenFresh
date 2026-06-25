
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gardenfresh-secg.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gf_token');
      localStorage.removeItem('gf_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  toggleWishlist: (id)  => api.post(`/auth/wishlist/${id}`),
};

// ─── Products ────────────────────────────────────────────
export const productAPI = {
  getAll:     (params) => api.get('/products', { params }),
  getOne:     (id)     => api.get(`/products/${id}`),
  getMine:    ()       => api.get('/products/farmer/mine'),
  create:     (data)   => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:     (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:     (id)     => api.delete(`/products/${id}`),
};

// ─── Farms ───────────────────────────────────────────────
export const farmAPI = {
  getAll:   (params) => api.get('/farms', { params }),
  getBySlug:(slug)   => api.get(`/farms/${slug}`),
  getMine:  ()       => api.get('/farms/mine'),
  create:   (data)   => api.post('/farms', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:   (data)   => api.put('/farms/mine', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  verify:   (id)     => api.put(`/farms/${id}/verify`),
};

// ─── Orders ──────────────────────────────────────────────
export const orderAPI = {
  create:        (data) => api.post('/orders', data),
  getMine:       ()     => api.get('/orders/mine'),
  getOne:        (id)   => api.get(`/orders/${id}`),
  getFarmerOrders: ()   => api.get('/orders/farmer/mine'),
  getAll:        (params) => api.get('/orders', { params }),
  updateStatus:  (id, data) => api.put(`/orders/${id}/status`, data),
};
