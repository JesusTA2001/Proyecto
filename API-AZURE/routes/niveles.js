const express = require('express');
const router = express.Router();
const nivelController = require('../controllers/nivelController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas para niveles
router.get('/', nivelController.getNiveles);
router.get('/:id', nivelController.getNivelById);

module.exports = router;
