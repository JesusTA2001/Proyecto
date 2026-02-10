const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getAlumnos,
  getAlumnosDisponibles,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
  toggleEstadoAlumno,
  updateDatosPersonalesAlumno,
  getGrupoEstudiante
} = require('../controllers/alumnoController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD
router.get('/', getAlumnos);
router.get('/disponibles/list', getAlumnosDisponibles);
router.get('/:id/grupo', getGrupoEstudiante);
router.get('/:id', getAlumnoById);
router.post('/', createAlumno);
router.put('/:id', updateAlumno);
router.patch('/:id/datos-personales', updateDatosPersonalesAlumno);
router.delete('/:id', deleteAlumno);
router.patch('/:id/toggle-estado', toggleEstadoAlumno);

module.exports = router;

