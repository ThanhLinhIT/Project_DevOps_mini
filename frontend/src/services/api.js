import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE, timeout: 12000 });

// ── Attach JWT to every request ───────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authRegister  = (data) => api.post('/auth/register', data);
export const authLogin     = (data) => api.post('/auth/login', data);
export const authGetMe     = ()     => api.get('/auth/me');

// ── Courts ────────────────────────────────────────────────────────────────────
export const getCourts     = ()          => api.get('/courts');
export const getCourtSlots = (id, date)  => api.get(`/courts/${id}/slots`, { params: { date } });
export const createCourt   = (data)      => api.post('/courts', data);
export const updateCourt   = (id, data)  => api.put(`/courts/${id}`, data);
export const deleteCourt   = (id)        => api.delete(`/courts/${id}`);

// ── Bookings ──────────────────────────────────────────────────────────────────
export const getBookings        = ()         => api.get('/bookings');
export const createBooking      = (data)     => api.post('/bookings', data);
export const updateBookingStatus= (id, status) => api.put(`/bookings/${id}/status`, { status });
export const deleteBooking      = (id)       => api.delete(`/bookings/${id}`);

// ── Users (Admin) ─────────────────────────────────────────────────────────────
export const getUsers          = ()      => api.get('/users');
export const getStats          = ()      => api.get('/users/stats');
export const updateUser        = (id, d) => api.put(`/users/${id}`, d);
export const toggleUserStatus  = (id)   => api.patch(`/users/${id}/toggle`);
export const deleteUser        = (id)   => api.delete(`/users/${id}`);

// ── Health ────────────────────────────────────────────────────────────────────
export const getHealth = () => api.get('/health');

export default api;
