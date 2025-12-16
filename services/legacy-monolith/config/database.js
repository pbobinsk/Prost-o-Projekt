// config/database.js
const { Sequelize } = require('sequelize');

// Tworzymy nową instancję Sequelize, używając zmiennych środowiskowych
// zdefiniowanych w docker-compose.yml
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log, // Włącz logowanie zapytań SQL do konsoli
  }
);

// Funkcja do testowania połączenia
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Połączenie z bazą danych zostało pomyślnie ustanowione.');
  } catch (error) {
    console.error('Nie można połączyć się z bazą danych:', error);
  }
};

module.exports = { sequelize, testDbConnection };