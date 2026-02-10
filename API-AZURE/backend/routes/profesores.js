const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getProfesores,
  getProfesorById,
  createProfesor,
  updateProfesor,
  deleteProfesor,
  toggleEstadoProfesor
} = require('../controllers/profesorController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD
router.get('/', getProfesores);
router.get('/:id', getProfesorById);
router.post('/', createProfesor);
router.put('/:id', updateProfesor);
router.delete('/:id', deleteProfesor);
router.patch('/:id/toggle-estado', toggleEstadoProfesor);

module.exports = router;

