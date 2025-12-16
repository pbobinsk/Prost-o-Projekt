// controllers/projectController.js
const Project = require('../models/Project');

// Wyświetl wszystkie projekty (READ)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    res.render('projects/index', { projects, title: 'Wszystkie Projekty' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Pokaż formularz do tworzenia nowego projektu
exports.showNewProjectForm = (req, res) => {
  res.render('projects/new', { title: 'Nowy Projekt' });
};

// Stwórz nowy projekt (CREATE)
exports.createProject = async (req, res) => {
  try {
    await Project.create({
      title: req.body.title,
      description: req.body.description,
    });
    res.redirect('/projects');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Pokaż formularz do edycji projektu
exports.showEditProjectForm = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (project) {
      res.render('projects/edit', { project, title: 'Edytuj Projekt' });
    } else {
      res.status(404).send('Projekt nie znaleziony');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Zaktualizuj projekt (UPDATE)
exports.updateProject = async (req, res) => {
  try {
    await Project.update(
      {
        title: req.body.title,
        description: req.body.description,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.redirect('/projects');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Usuń projekt (DELETE)
exports.deleteProject = async (req, res) => {
  try {
    await Project.destroy({
      where: { id: req.params.id },
    });
    res.redirect('/projects');
  } catch (error) {
    res.status(500).send(error.message);
  }
};