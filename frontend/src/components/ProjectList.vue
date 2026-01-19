<!-- frontend/src/components/ProjectList.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Tworzymy reaktywną zmienną, która będzie przechowywać naszą listę projektów
const projects = ref([]);
const error = ref(null);

// Funkcja, która zostanie wywołana, gdy komponent zostanie "zamontowany" na stronie
onMounted(async () => {
  try {
    // Wysyłamy żądanie do naszego backendu przez Nginx reverse proxy
    // UWAGA: Nie musimy podawać http://localhost:3000, bo Nginx załatwia to za nas!
    const response = await axios.get('/api/projects');
    projects.value = response.data;
  } catch (err) {
    // Prosta obsługa błędów
    error.value = 'Nie udało się pobrać projektów. Czy jesteś zalogowany?';
    console.error(err);
  }
});
</script>

<template>
  <div>
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
