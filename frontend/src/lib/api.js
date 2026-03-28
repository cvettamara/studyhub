"import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studyhub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studyhub_token');
      localStorage.removeItem('studyhub_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

// Map/Locations endpoints
export const locationsAPI = {
  getAll: () => api.get('/locations'),
  create: (data) => api.post('/locations', data),
  rate: (id, rating) => api.post(`/locations/${id}/rate`, { rating }),
};

// Marketplace endpoints
export const marketplaceAPI = {
  getAll: (subject) => api.get('/marketplace', { params: { subject } }),
  create: (data) => api.post('/marketplace', data),
  getById: (id) => api.get(`/marketplace/${id}`),
};

// Forum endpoints
export const forumAPI = {
  getQuestions: () => api.get('/forum/questions'),
  getQuestion: (id) => api.get(`/forum/questions/${id}`),
  createQuestion: (data) => api.post('/forum/questions', data),
  likeQuestion: (id) => api.post(`/forum/questions/${id}/like`),
  createAnswer: (questionId, data) => api.post(`/forum/questions/${questionId}/answers`, data),
};

// Events endpoints
export const eventsAPI = {
  getAll: () => api.get('/events'),
  create: (data) => api.post('/events', data),
  join: (id) => api.post(`/events/${id}/join`),
};

export default api;
"