// routes/projects.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// GET /projects - Pokaż wszystkie projekty
router.get('/', projectController.getAllProjects);

// GET /projects/new - Pokaż formularz tworzenia
router.get('/new', projectController.showNewProjectForm);

// POST /projects - Utwórz nowy projekt
router.post('/', projectController.createProject);

// GET /projects/:id/edit - Pokaż formularz edycji
router.get('/:id/edit', projectController.showEditProjectForm);

// POST /projects/:id/update - Zaktualizuj projekt
router.post('/:id/update', projectController.updateProject);

// POST /projects/:id/delete - Usuń projekt
router.post('/:id/delete', projectController.deleteProject);

module.exports = router;