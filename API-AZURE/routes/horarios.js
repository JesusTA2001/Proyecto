const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas para horarios
router.get('/', horarioController.getHorarios);
router.get('/:id', horarioController.getHorarioById);
router.post('/', horarioController.createHorario);
router.put('/:id', horarioController.updateHorario);
router.delete('/:id', horarioController.deleteHorario);
router.patch('/:id/toggle-estado', horarioController.toggleEstadoHorario);

module.exports = router;
