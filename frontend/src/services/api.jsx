import axios from 'axios';
import { getToken, logout } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Auto logout on 401 error
      logout();
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'An error occurred';
    
    console.error('API Error:', errorMessage);
    
    return Promise.reject({
      ...error,
      message: errorMessage
    });
  }
);

export default api;