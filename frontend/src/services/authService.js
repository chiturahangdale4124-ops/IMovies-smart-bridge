import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('imovies_token', response.data.token);
      localStorage.setItem('imovies_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('imovies_token', response.data.token);
      localStorage.setItem('imovies_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
  },
};
