import axios from 'axios';
import { getToken, clearToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://your-api-server:5178';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Ensure credentials are not sent with requests
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API
export const userApi = {
  getAll: () => api.get('/api/users'),
  getById: (id: number) => api.get(`/api/users/${id}`),
  create: (user: any) => api.post('/api/users', user),
  update: (id: number, user: any) => api.put(`/api/users/${id}`, user),
  delete: (id: number) => api.delete(`/api/users/${id}`),
};

// Auth API
export const authApi = {
  login: (username: string, password: string) => 
    api.post('/api/auth/login', { username, password }),
  register: (user: any) => 
    api.post('/api/auth/register', user),
};

export default api;
