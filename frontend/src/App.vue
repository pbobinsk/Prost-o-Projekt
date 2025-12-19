<!-- frontend/src/App.vue -->
<template>
  <div id="app">
    <header>
      <h1>Prost-o-Projekt <mark>SPA</mark></h1>
      <p>Aplikacja demonstracyjna w architekturze mikroserwisów</p>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>Faza 4 - Frontend w Vue.js</p>
    </footer>
  </div>
</template>

<!-- frontend/src/App.vue -->
<style>

/* W App.vue lub assets/main.css */

/* --- Podstawowe style globalne (zostawiamy bez zmian) --- */
body {
  background-color: #f0f2f5; /* Jasnoszare tło dla kontrastu */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
#app {
  max-width: 90ch;
  margin: 0 auto;
  padding: 2rem;
}
main {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* --- Proste i czytelne style dla formularzy --- */
input, textarea {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* ========================================================== */
/* --- PROSTE I NIEZAWODNE STYLE DLA PRZYCISKÓW ---           */
/* ========================================================== */

/* Domyślny, podstawowy przycisk (np. "Dodaj", "Zaloguj") */
button {
  background-color: #007bff; /* Wyraźny niebieski */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #0056b3; /* Ciemniejszy niebieski po najechaniu */
}

/* Przycisk drugorzędny (np. "Anuluj") */
button.secondary {
  background-color: #6c757d; /* Szary */
  color: white;
}
button.secondary:hover {
  background-color: #5a6268; /* Ciemniejszy szary */
}

/* Przycisk "niebezpieczny" (np. "Usuń") */
button.contrast {
  background-color: #dc3545; /* Wyraźny czerwony */
  color: white;
}
button.contrast:hover {
  background-color: #c82333; /* Ciemniejszy czerwony */
}

</style>