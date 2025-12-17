// routes/projects.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// GET / - Pobierz wszystkie projekty
router.get('/', projectController.getAllProjects);

// POST / - Stwórz nowy projekt
router.post('/', projectController.createProject);

// GET /:id - Pobierz konkretny projekt
router.get('/:id', projectController.getProjectById);

// PUT /:id - Zaktualizuj konkretny projekt
router.put('/:id', projectController.updateProject);

// DELETE /:id - Usuń konkretny projekt
router.delete('/:id', projectController.deleteProject);


module.exports = router;