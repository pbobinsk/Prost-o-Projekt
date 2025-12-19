// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Importuj widoki (które zaraz stworzymy)
import Projects from '../views/Projects.vue';
import Login from '../views/Login.vue';

const routes = [
  { path: '/', redirect: '/projects' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/projects', name: 'Projects', component: Projects, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Globalny strażnik nawigacji (Navigation Guard)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Jeśli ścieżka wymaga logowania, a użytkownik nie jest zalogowany,
    // przekieruj go na stronę logowania.
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;