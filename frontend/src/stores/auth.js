// frontend/src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  // Stan (State)
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Getters (właściwości wyliczane)
  const isAuthenticated = computed(() => !!token.value);

  // Akcje (Actions)
  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  }

  function setUser(newUser) {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  async function login(credentials) {
    const response = await axios.post('/api/auth/login', credentials);
    setToken(response.data.access_token);
    // Proste dekodowanie payloadu z tokenu JWT
    const payload = JSON.parse(atob(response.data.access_token.split('.')[1]));
    setUser({ id: payload.id, email: payload.sub });
  }

  async function register(credentials) {
    await axios.post('/api/auth/register', credentials);
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  return { token, user, isAuthenticated, login, register, logout };
});