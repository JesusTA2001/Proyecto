const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// ========================================
// CATÁLOGO DE ESTUDIOS
// ========================================
router.get('/catalogo', estudioController.getCatalogoEstudios);

// ========================================
// ESTUDIOS DE PROFESORES
// ========================================

// Obtener todos los estudios de un profesor
router.get('/profesor/:id', estudioController.getEstudiosProfesor);

// Agregar un estudio a un profesor
router.post('/profesor/:id', estudioController.createEstudioProfesor);

// Actualizar un estudio específico
router.put('/:id', estudioController.updateEstudio);

// Eliminar un estudio específico
router.delete('/:id', estudioController.deleteEstudio);

module.exports = router;
