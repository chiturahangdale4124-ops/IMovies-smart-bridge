import api from './api';

export const theatreService = {
  getTheatres: async () => {
    const response = await api.get('/theatres');
    return response.data;
  },

  getTheatreById: async (id) => {
    const response = await api.get(`/theatres/${id}`);
    return response.data;
  },

  createTheatre: async (theatreData) => {
    const response = await api.post('/theatres', theatreData);
    return response.data;
  },

  updateTheatre: async (id, theatreData) => {
    const response = await api.put(`/theatres/${id}`, theatreData);
    return response.data;
  },

  deleteTheatre: async (id) => {
    const response = await api.delete(`/theatres/${id}`);
    return response.data;
  },
};
