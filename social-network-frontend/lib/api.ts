import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        message.error('Unauthorized: Please login again');
      } else if (status === 403) {
        message.error('Forbidden: You do not have permission');
      } else if (status === 404) {
        message.error('Resource not found');
      } else if (status >= 500) {
        message.error('Server error');
      } else if (data && data.error) {
        message.error(data.error);
      }
    } else if (error.request) {
      message.error('Network error: Please check your connection');
    } else {
      message.error('Request error');
    }
    
    return Promise.reject(error);
  }
);

export default api;