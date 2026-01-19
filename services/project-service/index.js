// services/project-service/index.js

const express = require('express');
const { sequelize, testDbConnection } = require('./config/database');
const Project = require('./models/Project');

const app = express();
const port = process.env.PORT || 3000;
let server; // Zmienna do przechowywania instancji serwera

app.use(express.json());

const projectRoutes = require('./routes/projects');
app.use('/', projectRoutes);

const startServer = async () => {
  await testDbConnection();
  await sequelize.sync(); 
  return new Promise((resolve) => {
    server = app.listen(port, () => {
      console.log(`Project Service running on port ${port}`);
      resolve();
    });
  });
};

const stopServer = async () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        console.log('Server stopped');
        resolve();
      });
    }
  });
};

// Jeśli plik jest uruchamiany bezpośrednio, uruchom serwer
if (require.main === module) {
  startServer();
}

// Eksportuj aplikację i funkcje do użycia w testach
module.exports = { app, startServer, stopServer };