<!-- frontend/src/views/Register.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref(null);
const success = ref(false);

const handleRegister = async () => {
  try {
    error.value = null;
    success.value = false;
    await authStore.register({ email: email.value, password: password.value });
    success.value = true;
    // Opcjonalnie: automatyczne przekierowanie do logowania po chwili
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    error.value = err.response?.data?.detail || 'Rejestracja nie powiodła się.';
  }
};
</script>
<template>
  <div>
    <h2>Rejestracja</h2>
    <form @submit.prevent="handleRegister">
      <label for="email">Email</label>
      <input v-model="email" type="email" id="email" required />
      
      <label for="password">Hasło</label>
      <input v-model="password" type="password" id="password" required />
      
      <button type="submit">Zarejestruj</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Rejestracja pomyślna! Za chwilę zostaniesz przekierowany do logowania.</p>
    <p>Masz już konto? <router-link to="/login">Zaloguj się</router-link></p>
  </div>
</template>
<style scoped>
.error { color: red; }
.success { color: green; }
</style>