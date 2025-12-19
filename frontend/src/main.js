import { createApp } from 'vue'
import { createPinia } from 'pinia'; // Import Pinia
import './style.css'
import App from './App.vue'
import router from './router';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);      // Użyj routera

app.mount('#app');