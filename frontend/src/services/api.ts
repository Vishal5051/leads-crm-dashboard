import axios from 'axios';

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Standardize error formats
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = error.response?.data?.message || error.message || 'An unexpected server error occurred';
    return Promise.reject(new Error(customError));
  }
);

export default API;
