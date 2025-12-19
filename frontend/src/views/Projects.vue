<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const projects = ref([]);
const error = ref(null);
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(async () => {
  try {
    // Pamiętajmy, aby dołączać token do żądań!
    const token = authStore.token;
    if (token) {
      const response = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      projects.value = response.data;
    }
  } catch (err) {
    error.value = 'Nie udało się pobrać projektów.';
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      // Jeśli token jest nieważny, wyloguj
      handleLogout();
    }
  }
});
</script>

<template>
  <div>
    <button @click="handleLogout" style="float: right;">Wyloguj</button>
    <h2>Lista Projektów</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-else-if="projects.length > 0">
      <li v-for="project in projects" :key="project.id">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
      </li>
    </ul>
    <div v-else>
      <p>Brak projektów do wyświetlenia lub trwa ładowanie...</p>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
