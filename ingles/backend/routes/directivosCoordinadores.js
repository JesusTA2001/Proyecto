const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getDirectivosCoordinadores,
  createDirectivoCoordinador,
  updateDirectivoCoordinador,
  toggleEstadoDirectivoCoordinador
} = require('../controllers/directivoCoordinadorController');

router.use(authMiddleware);

router.get('/', getDirectivosCoordinadores);
router.post('/', createDirectivoCoordinador);
router.put('/:id', updateDirectivoCoordinador);
router.patch('/:id/toggle-estado', toggleEstadoDirectivoCoordinador);

module.exports = router;
