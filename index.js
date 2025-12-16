const express = require('express');

// Inicjalizacja aplikacji Express
const app = express();
const port = process.env.PORT || 3000;

// Ustawienie EJS jako silnika szablonów
app.set('view engine', 'ejs');

// Prosty endpoint na stronie głównej
app.get('/', (req, res) => {
  // Renderuj plik 'index.ejs' z folderu 'views'
  res.render('index', { 
    title: 'Prost-o-Projekt',
    message: 'Witaj w Fazie 1: Monolit MVC!' 
  });
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer monolit "Prost-o-Projekt" działa na porcie ${port}`);
  console.log(`Otwórz w przeglądarce: http://localhost:${port}`);
});