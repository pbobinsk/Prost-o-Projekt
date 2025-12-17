// controllers/projectController.js
const Project = require('../models/Project');

// Wyświetl wszystkie projekty (READ)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

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

    // Prosta walidacja
    if (!title) {
      return res.status(400).json({ error: "Pole 'title' jest wymagane." });
    }

    const newProject = await Project.create({ title, description });
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

    // Sprawdź, czy projekt do aktualizacji w ogóle istnieje
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Projekt o podanym ID nie został znaleziony." });
    }
    
    // Prosta walidacja
    if (!title) {
        return res.status(400).json({ error: "Pole 'title' jest wymagane." });
    }

    // Zaktualizuj projekt
    project.title = title;
    project.description = description;
    await project.save();

    // Zwróć zaktualizowany obiekt
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Wystąpił błąd serwera przy aktualizacji projektu.", details: error.message });
  }
};

// DELETE /:id - Usuń projekt (DELETE)
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: "Projekt o podanym ID nie został znaleziony." });
    }

    await project.destroy();

    // Po pomyślnym usunięciu zwróć status 204 No Content i nie wysyłaj żadnego ciała odpowiedzi.
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Wystąpił błąd serwera przy usuwaniu projektu.", details: error.message });
  }
};