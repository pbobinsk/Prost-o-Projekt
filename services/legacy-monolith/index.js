const express = require('express');
const { sequelize, testDbConnection } = require('./config/database');
const Project = require('./models/Project');

// Inicjalizacja aplikacji
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Do parsowania danych z formularzy
app.set('view engine', 'ejs');

// Ścieżki (Routes)
const projectRoutes = require('./routes/projects');
app.use('/projects', projectRoutes);

// Strona główna
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Strona Główna',
    message: 'Witaj w Fazie 1: Monolit MVC!' 
  });
});

// Uruchomienie serwera i synchronizacja bazy danych
const startServer = async () => {
  await testDbConnection();
  // Synchronizuj modele z bazą danych. To stworzy tabelę, jeśli nie istnieje.
  await sequelize.sync(); 
  // await sequelize.sync({ force: true }); // Użyj tego, aby wyczyścić i odtworzyć tabele

  app.listen(port, () => {
    console.log(`Serwer monolit "Prost-o-Projekt" działa na porcie ${port}`);
    console.log(`Otwórz w przeglądarce: http://localhost:${port}`);
  });
};

startServer();