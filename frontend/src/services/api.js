import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
};

export const todosAPI = {
  getAll: async () => {
    const response = await api.get('/todos');
    return response.data;
  },

  create: async (todo) => {
    const response = await api.post('/todos', todo);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },
};

export default api;