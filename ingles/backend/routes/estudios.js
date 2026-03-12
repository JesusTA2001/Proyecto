const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');
const { authMiddleware } = require('../middleware/auth');

// ========================================
// CATÁLOGO DE ESTUDIOS (Público)
// ========================================
// Esta ruta es pública porque solo devuelve los niveles de estudio disponibles
router.get('/catalogo', estudioController.getCatalogoEstudios);

// ========================================
// ESTUDIOS DE PROFESORES (Requieren autenticación)
// ========================================

// Todas las rutas siguientes requieren autenticación
router.use(authMiddleware);

// Obtener todos los estudios de un profesor
router.get('/profesor/:id', estudioController.getEstudiosProfesor);

// Agregar un estudio a un profesor
router.post('/profesor/:id', estudioController.createEstudioProfesor);

// Actualizar un estudio específico
router.put('/:id', estudioController.updateEstudio);

// Eliminar un estudio específico
router.delete('/:id', estudioController.deleteEstudio);

module.exports = router;
