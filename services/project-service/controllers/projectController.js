// controllers/projectController.js
const Project = require('../models/Project');

// Wyświetl wszystkie projekty (READ)
exports.getAllProjects = async (req, res) => {
  try {
    const ownerId = req.headers['x-user-id'];
    const projects = await Project.findAll({ 
      where: { ownerId: ownerId },
      order: [['createdAt', 'DESC']] });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const ownerId = req.headers['x-user-id'];

    const project = await Project.findOne({
      where: {
        id: projectId,      // Warunek 1: ID projektu musi się zgadzać
        ownerId: ownerId    // Warunek 2: ID właściciela musi się zgadzać
      }
    });

    if (!project) {
      return res.status(404).json({ error: "Projekt o podanym ID nie został znaleziony." });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Wystąpił błąd serwera.", details: error.message });
  }
};


// Stwórz nowy projekt (CREATE)
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ownerId = req.headers['x-user-id']; // Odczytaj ID użytkownika z nagłówka

    // Prosta walidacja
    if (!title) {
      return res.status(400).json({ error: "Pole 'title' jest wymagane." });
    }
    if (!ownerId) {
      return res.status(400).json({ error: "Brak informacji o użytkowniku w nagłówku." });
    }

    const newProject = await Project.create({ title, description, ownerId });
    res.status(201).json(newProject);
  } catch (error) {
    // Tutaj można dodać bardziej szczegółową obsługę błędów walidacji z Sequelize
    res.status(500).json({ error: "Wystąpił błąd serwera przy tworzeniu projektu.", details: error.message });
  }
};

// Zaktualizuj projekt (UPDATE)
exports.updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const projectId = req.params.id;
    const ownerId = req.headers['x-user-id'];

    // Prosta walidacja
    if (!title) {
        return res.status(400).json({ error: "Pole 'title' jest wymagane." });
    }

    const [numberOfAffectedRows] = await Project.update(
      { title, description }, // Dane do aktualizacji
      {
        where: {
          id: projectId,
          ownerId: ownerId
        },
        returning: true // Opcja, która sprawia, że w PostgreSQL zwrócony zostanie zaktualizowany obiekt
      }
    );

    if (numberOfAffectedRows === 0) {
      // Jeśli 0 wierszy zostało zaktualizowanych, to znaczy, że nie znaleziono projektu
      // pasującego do OBU warunków (id i ownerId).
      return res.status(404).json({ error: "Projekt o podanym ID nie został znaleziony lub nie masz do niego uprawnień." });
    }

    // Po udanej aktualizacji, pobierz i zwróć zaktualizowany obiekt, aby klient go zobaczył
    const updatedProject = await Project.findOne({ where: { id: projectId, ownerId: ownerId }});
    res.status(200).json(updatedProject);
    
  } catch (error) {
    res.status(500).json({ error: "Wystąpił błąd serwera przy aktualizacji projektu.", details: error.message });
  }
};

// DELETE /:id - Usuń projekt (DELETE)
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const ownerId = req.headers['x-user-id'];
    
    // Metoda destroy zwraca liczbę usuniętych wierszy
    const numberOfDestroyedRows = await Project.destroy({
      where: {
        id: projectId,
        ownerId: ownerId
      }
    });

    if (numberOfDestroyedRows === 0) {
      return res.status(404).json({ error: "Projekt o podanym ID nie został znaleziony lub nie masz do niego uprawnień." });
    }

    // Po pomyślnym usunięciu zwróć status 204 No Content.
    res.status(204).send();    

  } catch (error) {
    res.status(500).json({ error: "Wystąpił błąd serwera przy usuwaniu projektu.", details: error.message });
  }
};