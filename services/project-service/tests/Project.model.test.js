// services/project-service/tests/Project.model.test.js

const { Sequelize, DataTypes } = require('sequelize');
const ProjectModel = require('../models/Project'); // Importujemy definicję modelu

describe('Project Model (Unit Tests)', () => {
  let sequelize;

  // Przed wszystkimi testami w tym pliku, skonfiguruj nową,
  // tymczasową instancję Sequelize z bazą danych w pamięci.
  beforeAll(() => {
    sequelize = new Sequelize('sqlite::memory:'); // Baza SQLite w pamięci
    
    // Inicjalizuj model na tej tymczasowej instancji sequelize
    ProjectModel.init({
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ownerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, { sequelize, modelName: 'Project' });

    // Synchronizuj model z bazą w pamięci
    return sequelize.sync();
  });

  // Czyść tabelę przed każdym testem
  beforeEach(async () => {
    await ProjectModel.destroy({ truncate: true });
  });

  // Zamknij połączenie po wszystkich testach
  afterAll(() => {
    return sequelize.close();
  });

  // TEST 1: Sprawdź, czy model poprawnie tworzy wpis
  test('should create a project with all required fields', async () => {
    const project = await ProjectModel.create({
      title: 'Testowy Projekt',
      ownerId: 'user-123',
      description: 'Opis',
    });
    
    expect(project).toBeDefined();
    expect(project.title).toBe('Testowy Projekt');
    expect(project).toHaveProperty('id');
  });

  // TEST 2: Sprawdź walidację - czy pole 'title' jest wymagane
  test('should fail to create a project without a title', async () => {
    // Używamy expect.assertions, aby upewnić się, że asercja w bloku catch zostanie wykonana
    expect.assertions(1);
    
    try {
      await ProjectModel.create({
        ownerId: 'user-123',
      });
    } catch (error) {
      // Oczekujemy, że Sequelize rzuci błędem walidacji
      expect(error.name).toBe('SequelizeValidationError');
    }
  });

  // TEST 3: Sprawdź walidację - czy pole 'ownerId' jest wymagane
  test('should fail to create a project without an ownerId', async () => {
    expect.assertions(1);
    
    try {
      await ProjectModel.create({
        title: 'Projekt bez właściciela',
      });
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });
});