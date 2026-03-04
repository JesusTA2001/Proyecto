const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');

// Registrar una asistencia individual
router.post('/registrar', asistenciaController.registrarAsistencia);

// Eliminar una asistencia individual
router.delete('/eliminar', asistenciaController.eliminarAsistencia);

// Guardar asistencias masivas (toda la lista de un grupo en una fecha)
router.post('/guardar-masivas', asistenciaController.guardarAsistenciasMasivas);

// Obtener asistencias de un grupo en una fecha específica
router.get('/grupo', asistenciaController.obtenerAsistenciasPorGrupoFecha);

// Obtener estadísticas de un grupo
router.get('/estadisticas/:id_Grupo', asistenciaController.obtenerEstadisticasGrupo);

// Obtener historial de un alumno
router.get('/historial/:nControl', asistenciaController.obtenerHistorialAlumno);

module.exports = router;
