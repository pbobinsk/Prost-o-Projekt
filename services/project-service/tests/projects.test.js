// services/project-service/tests/projects.test.js

const request = require('supertest');
// Importujemy naszą aplikację Express i model Sequelize
const { app, startServer, stopServer } = require('../index'); // Musimy wyeksportować te elementy z index.js
const { sequelize } = require('../config/database');
const Project = require('../models/Project');

// Uruchom serwer przed wszystkimi testami w tym pliku
beforeAll(async () => {
  // Poczekaj na pełne uruchomienie serwera i synchronizację bazy
  await startServer(); 
});

// Zatrzymaj serwer po wszystkich testach
afterAll(async () => {
  await stopServer();
  await sequelize.close(); // Zamknij połączenie z bazą
});

// CZYŚĆ BAZĘ DANYCH PRZED KAŻDYM TESTEM
// To jest kluczowe dla izolacji testów!
beforeEach(async () => {
  await Project.destroy({ truncate: true });
});

describe('Project API Endpoints', () => {
  const MOCK_USER_ID = 'user-123-abc'; // Użyjemy stałego ID użytkownika w testach

  // --- Testy dla GET / ---
  test('GET / should return an empty array initially', async () => {
    const response = await request(app)
      .get('/')
      .set('x-user-id', MOCK_USER_ID); // Symulujemy nagłówek od API Gateway

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  // --- Testy dla POST / ---
  test('POST / should create a new project', async () => {
    const newProject = {
      title: 'Nowy Testowy Projekt',
      description: 'Opis projektu.'
    };

    const response = await request(app)
      .post('/')
      .set('x-user-id', MOCK_USER_ID)
      .send(newProject);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newProject.title);
    expect(response.body.ownerId).toBe(MOCK_USER_ID);
    expect(response.body).toHaveProperty('id');
  });

  // --- Testy dla GET /:id, PUT /:id, DELETE /:id ---
  test('should handle GET, PUT, and DELETE for a specific project', async () => {
    // 1. Stwórz projekt, aby mieć co testować
    const project = await Project.create({ 
      title: 'Projekt do testów', 
      ownerId: MOCK_USER_ID 
    });

    // 2. Przetestuj GET /:id
    const getResponse = await request(app)
      .get(`/${project.id}`)
      .set('x-user-id', MOCK_USER_ID);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.title).toBe('Projekt do testów');

    // 3. Przetestuj PUT /:id
    const updatedData = { title: 'Zaktualizowany Tytuł' };
    const putResponse = await request(app)
      .put(`/${project.id}`)
      .set('x-user-id', MOCK_USER_ID)
      .send(updatedData);
    
    expect(putResponse.statusCode).toBe(200);
    expect(putResponse.body.title).toBe('Zaktualizowany Tytuł');

    // 4. Przetestuj DELETE /:id
    const deleteResponse = await request(app)
      .delete(`/${project.id}`)
      .set('x-user-id', MOCK_USER_ID);

    expect(deleteResponse.statusCode).toBe(204);

    // 5. Sprawdź, czy projekt został faktycznie usunięty
    const finalGetResponse = await request(app)
      .get(`/${project.id}`)
      .set('x-user-id', MOCK_USER_ID);
    
    expect(finalGetResponse.statusCode).toBe(404);
  });

  test('should not allow access to other users projects', async () => {
    // Stwórz projekt należący do MOCK_USER_ID
    const project = await Project.create({ 
      title: 'Prywatny Projekt', 
      ownerId: MOCK_USER_ID 
    });

    // Spróbuj uzyskać do niego dostęp jako INNY użytkownik
    const response = await request(app)
      .get(`/${project.id}`)
      .set('x-user-id', 'inny-uzytkownik-456'); // Inny ID

    expect(response.statusCode).toBe(404); // Oczekujemy 404, bo serwis nie powinien znaleźć projektu dla tego ownerId
  });
});