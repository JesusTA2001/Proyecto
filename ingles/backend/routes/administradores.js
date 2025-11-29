const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getAdministradores,
  getAdministradorById,
  createAdministrador,
  updateAdministrador,
  deleteAdministrador,
  toggleEstadoAdministrador
} = require('../controllers/administradorController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD
router.get('/', getAdministradores);
router.get('/:id', getAdministradorById);
router.post('/', createAdministrador);
router.put('/:id', updateAdministrador);
router.delete('/:id', deleteAdministrador);
router.patch('/:id/toggle-estado', toggleEstadoAdministrador);

module.exports = router;
