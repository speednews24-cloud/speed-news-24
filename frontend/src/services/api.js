import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sn24_access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const articleApi = {
  list: (params) => api.get('/articles', { params }).then((r) => r.data),
  get: (slug) => api.get(`/articles/${slug}`).then((r) => r.data),
  create: (payload) => api.post('/articles', payload).then((r) => r.data)
};

export const categoryApi = {
  list: () => api.get('/categories').then((r) => r.data),
  create: (payload) => api.post('/categories', payload).then((r) => r.data)
};

export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data)
};

export const adminApi = {
  analytics: () => api.get('/admin/analytics').then((r) => r.data),
  aggregate: () => api.post('/admin/aggregate-news').then((r) => r.data),
  ads: () => api.get('/admin/ads').then((r) => r.data),
  createAd: (payload) => api.post('/admin/ads', payload).then((r) => r.data)
};
