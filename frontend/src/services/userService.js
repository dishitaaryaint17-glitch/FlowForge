import apiClient from './apiClient';

export const userService = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return (response.data.users || []).map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));
  },

  getSettings: async () => {
    const response = await apiClient.get('/users/me/settings');
    return response.data;
  },

  updateSettings: async (payload) => {
    const response = await apiClient.put('/users/me/settings', payload);
    return response.data.settings;
  },
};
