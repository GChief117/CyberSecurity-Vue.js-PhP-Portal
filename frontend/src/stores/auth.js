import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('auth_token'),
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async login(credentials) {
      const response = await api.auth.login(credentials);
      const { user, token } = response.data;
      
      this.user = user;
      this.token = token;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      
      return response;
    },
    
    async logout() {
      try {
        await api.auth.logout();
      } catch (e) {
        console.error('Logout error:', e);
      }
      
      this.user = null;
      this.token = null;
      
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    },
  },
});
