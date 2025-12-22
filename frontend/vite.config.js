// frontend/vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // NOWA SEKCJA: Konfiguracja Vitest
  test: {
    // Użyj JSDOM do symulowania środowiska przeglądarki w Node.js
    environment: 'jsdom',
    // Opcjonalnie: wyczyść mocki po każdym teście
    clearMocks: true,
  },
})