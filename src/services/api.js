import axios from 'axios';

const API_URL = 'https://betatestnew.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 