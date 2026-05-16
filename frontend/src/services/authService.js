import apiClient from './apiClient';

export const authService = {
  login: async ({ email, password }) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async ({ name, email, password }) => {
    const response = await apiClient.post('/auth/signup', { name, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data.users || [];
  },
};
