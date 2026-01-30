const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas para grupos
router.get('/historial', grupoController.getHistorialGrupos);
router.get('/', grupoController.getGrupos);
router.get('/:id', grupoController.getGrupoById);
router.post('/', grupoController.createGrupo);
router.put('/:id', grupoController.updateGrupo);
router.delete('/:id', grupoController.deleteGrupo);

// Rutas para gestionar alumnos en grupos
router.post('/:id/estudiantes', grupoController.agregarAlumnos);
router.delete('/:id/estudiantes/:nControl', grupoController.quitarAlumno);

module.exports = router;
