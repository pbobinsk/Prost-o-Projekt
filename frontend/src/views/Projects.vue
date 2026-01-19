<!-- frontend/src/views/Projects.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const projects = ref([]);
const error = ref(null);
const authStore = useAuthStore();
const router = useRouter();

// Stan dla formularza dodawania/edycji
const newProjectTitle = ref('');
const newProjectDescription = ref('');
const editingProject = ref(null); // Przechowuje ID edytowanego projektu

// --- Funkcje do obsługi API ---
const fetchProjects = async () => {
  try {
    error.value = null;
    const response = await axios.get('/api/projects');
    projects.value = response.data;
  } catch (err) {
    handleApiError(err);
  }
};

const handleAddOrUpdateProject = async () => {
  const payload = {
    title: newProjectTitle.value,
    description: newProjectDescription.value,
  };
  
  try {
    if (editingProject.value) {
      // Tryb edycji
      await axios.put(`/api/projects/${editingProject.value.id}`, payload);
    } else {
      // Tryb dodawania
      await axios.post('/api/projects', payload);
    }
    resetForm();
    await fetchProjects(); // Odśwież listę
  } catch (err) {
    handleApiError(err);
  }
};

const handleDeleteProject = async (projectId) => {
  if (confirm('Czy na pewno chcesz usunąć ten projekt?')) {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      await fetchProjects(); // Odśwież listę
    } catch (err) {
      handleApiError(err);
    }
  }
};

// --- Funkcje pomocnicze ---
const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const startEditing = (project) => {
  editingProject.value = project;
  newProjectTitle.value = project.title;
  newProjectDescription.value = project.description;
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Przewiń na górę do formularza
};

const resetForm = () => {
  newProjectTitle.value = '';
  newProjectDescription.value = '';
  editingProject.value = null;
};

const handleApiError = (err) => {
  error.value = err.response?.data?.error || 'Wystąpił błąd.';
  if (err.response && (err.response.status === 401 || err.response.status === 403)) {
    handleLogout();
  }
};

// --- Cykl życia komponentu ---
onMounted(fetchProjects);
</script>

<template>
  <div>
    <header class="projects-header">
      <h2>Twoje Projekty</h2>
      <button @click="handleLogout" class="secondary">Wyloguj</button>
    </header>

    <!-- Formularz dodawania/edycji -->
    <article>
      <form @submit.prevent="handleAddOrUpdateProject">
        <h3>{{ editingProject ? 'Edytuj projekt' : 'Dodaj nowy projekt' }}</h3>
        <label for="title">Tytuł</label>
        <input v-model="newProjectTitle" type="text" id="title" required />
        
        <label for="description">Opis</label>
        <textarea v-model="newProjectDescription" id="description" rows="3"></textarea>
        
        <div class="form-buttons">
          <button type="submit">{{ editingProject ? 'Zapisz zmiany' : 'Dodaj projekt' }}</button>
          <button v-if="editingProject" @click="resetForm" type="button" class="secondary">Anuluj edycję</button>
        </div>
      </form>
    </article>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- Lista projektów -->
    <div v-if="projects.length > 0">
      <article v-for="project in projects" :key="project.id">
        <header>
          <h3>{{ project.title }}</h3>
        </header>
        <p>{{ project.description }}</p>
        <footer>
          <button @click="startEditing(project)">Edytuj</button>
          <button @click="handleDeleteProject(project.id)" class="contrast">Usuń</button>
        </footer>
      </article>
    </div>
    <p v-else>Nie masz jeszcze żadnych projektów. Dodaj pierwszy!</p>
  </div>
</template>

<style scoped>
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-buttons {
  display: flex;
  gap: 1rem;
}

.error {
  color: #d32f2f;
  margin-top: 1rem;
}

article footer {
  display: flex;
  gap: 0.5rem;
}
</style>