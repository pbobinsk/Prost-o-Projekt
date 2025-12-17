// services/project-service/index.js
const express = require('express');
const { sequelize, testDbConnection } = require('./config/database');

const app = express();
app.use(express.json()); // Użyj parsera JSON

const projectRoutes = require('./routes/projects');
app.use('/', projectRoutes); // Użyj ścieżek bez prefiksu /projects

const startServer = async () => {
  await testDbConnection();
  await sequelize.sync();
  app.listen(3000, () => console.log('Project Service running on port 3000'));
};
startServer();