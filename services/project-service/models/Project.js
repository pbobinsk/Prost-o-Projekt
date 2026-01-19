// models/Project.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  // Sequelize automatycznie stworzy pole 'id' jako klucz główny
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ownerId: {
    type: DataTypes.STRING, // Używamy STRING, bo MongoDB ID to string
    allowNull: false,
  },
});

module.exports = Project;