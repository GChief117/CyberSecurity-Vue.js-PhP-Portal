import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const api = {
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    getUser: () => apiClient.get('/auth/me'),
  },
  
  dashboard: {
    getStats: () => apiClient.get('/dashboard/stats'),
  },
  
  threats: {
    getAll: (params = {}) => apiClient.get('/threats', { params }),
    getById: (id) => apiClient.get('/threats/' + id),
    acknowledge: (id) => apiClient.post('/threats/' + id + '/acknowledge'),
    resolve: (id, data) => apiClient.post('/threats/' + id + '/resolve', data),
  },
  
  systems: {
    getAll: () => apiClient.get('/systems'),
    getById: (id) => apiClient.get('/systems/' + id),
    getMetrics: (id, params = {}) => apiClient.get('/systems/' + id + '/metrics', { params }),
  },
  
  incidents: {
    getAll: (params = {}) => apiClient.get('/incidents', { params }),
    getById: (id) => apiClient.get('/incidents/' + id),
    create: (data) => apiClient.post('/incidents', data),
    update: (id, data) => apiClient.patch('/incidents/' + id, data),
    delete: (id) => apiClient.delete('/incidents/' + id),
  },
  
  alerts: {
    getAll: (params = {}) => apiClient.get('/alerts', { params }),
    dismiss: (id) => apiClient.delete('/alerts/' + id),
    dismissAll: (data = {}) => apiClient.post('/alerts/dismiss-all', data),
  },
  
  simulate: {
    threat: () => apiClient.post('/simulate/threat'),
    alert: () => apiClient.post('/simulate/alert'),
    incident: () => apiClient.post('/simulate/incident'),
    random: () => apiClient.post('/simulate/random'),
    systems: () => apiClient.post('/simulate/systems'),
  },
  
  post: (url, data = {}) => apiClient.post(url, data),
};

export default api;
export { apiClient, BASE_URL };
