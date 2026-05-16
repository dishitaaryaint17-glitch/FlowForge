import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
});

const fallbackMessages = {
  400: 'Please review the highlighted fields and try again',
  401: 'Invalid email or password',
  403: 'You do not have permission to complete this action',
  404: 'The requested item was not found',
  429: 'Too many requests. Please wait a moment and try again',
  500: 'We could not complete that request right now',
};

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage = error.response?.data?.message;
    const status = error.response?.status;
    error.message = backendMessage || fallbackMessages[status] || error.message || 'Network error';
    return Promise.reject(error);
  }
);

export default apiClient;
