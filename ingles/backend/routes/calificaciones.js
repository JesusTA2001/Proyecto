const express = require('express');
const router = express.Router();
const calificacionesController = require('../controllers/calificacionesController');

// Obtener calificaciones de un estudiante
router.get('/estudiante/:nControl', calificacionesController.getCalificacionesEstudiante);

// Obtener calificaciones de un grupo
router.get('/grupo/:id_Grupo', calificacionesController.getCalificacionesGrupo);

// Guardar calificaciones (masivo)
router.post('/guardar', calificacionesController.guardarCalificaciones);

// Guardar calificación individual (para guardado automático)
router.post('/guardar-individual', calificacionesController.guardarCalificacionIndividual);

// Eliminar calificación
router.delete('/:id', calificacionesController.eliminarCalificacion);

module.exports = router;
