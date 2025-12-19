<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref(null);

const handleLogin = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push('/projects'); // Przekieruj po pomyślnym logowaniu
  } catch (err) {
    error.value = 'Logowanie nie powiodło się. Sprawdź dane.';
  }
};
</script>
<template>
  <div>
    <h2>Logowanie</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Hasło" required />
      <button type="submit">Zaloguj</button>
    </form>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>