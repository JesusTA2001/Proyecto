const { pool } = require('../config/db');

// Verificar y actualizar estado de grupos según reglas de negocio
exports.verificarEstadoGrupos = async (req, res) => {
  try {
    const fechaActual = new Date();
    
    // Obtener grupos activos con su información de periodo y calificaciones
    const [grupos] = await pool.query(`
      SELECT 
        g.id_Grupo,
        g.grupo,
        g.estado,
        p.fecha_fin,
        COUNT(DISTINCT ge.nControl) as total_alumnos,
        COUNT(DISTINCT CASE 
          WHEN c.parcial1 IS NOT NULL 
            AND c.parcial2 IS NOT NULL 
            AND c.parcial3 IS NOT NULL 
            AND c.final IS NOT NULL 
          THEN c.nControl 
        END) as alumnos_con_calificaciones_completas
      FROM Grupo g
      LEFT JOIN Periodo p ON g.id_Periodo = p.id_Periodo
      LEFT JOIN GrupoEstudiante ge ON g.id_Grupo = ge.id_Grupo
      LEFT JOIN Calificaciones c ON g.id_Grupo = c.id_Grupo AND ge.nControl = c.nControl
      WHERE g.estado = 'activo'
      GROUP BY g.id_Grupo, g.grupo, g.estado, p.fecha_fin
    `);

    const gruposParaInactivar = [];

    for (const grupo of grupos) {
      let debeInactivar = false;
      let razon = '';

      // Condición 1: Verificar si el periodo ya concluyó
      if (grupo.fecha_fin) {
        const fechaFin = new Date(grupo.fecha_fin);
        if (fechaActual > fechaFin) {
          debeInactivar = true;
          razon = 'Periodo concluido';
        }
      }

      // Condición 2: Verificar si todas las calificaciones están completas
      if (grupo.total_alumnos > 0 && 
          grupo.total_alumnos === grupo.alumnos_con_calificaciones_completas) {
        // Si todas las calificaciones están completas, verificar también la fecha
        if (grupo.fecha_fin) {
          const fechaFin = new Date(grupo.fecha_fin);
          if (fechaActual > fechaFin) {
            debeInactivar = true;
            razon = 'Calificaciones completas y periodo concluido';
          }
        }
      }

      if (debeInactivar) {
        gruposParaInactivar.push({
          id_Grupo: grupo.id_Grupo,
          nombre: grupo.grupo,
          razon
        });
      }
    }

    // Inactivar los grupos que cumplan las condiciones
    if (gruposParaInactivar.length > 0) {
      const idsGrupos = gruposParaInactivar.map(g => g.id_Grupo);
      await pool.query(`
        UPDATE Grupo 
        SET estado = 'inactivo' 
        WHERE id_Grupo IN (?)
      `, [idsGrupos]);
    }

    res.json({
      success: true,
      message: `Se verificaron ${grupos.length} grupos activos`,
      gruposInactivados: gruposParaInactivar.length,
      detalles: gruposParaInactivar
    });

  } catch (error) {
    console.error('Error al verificar estado de grupos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar estado de grupos',
      error: error.message
    });
  }
};

// Inactivar un grupo manualmente
exports.inactivarGrupo = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`
      UPDATE Grupo 
      SET estado = 'inactivo' 
      WHERE id_Grupo = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Grupo inactivado correctamente'
    });

  } catch (error) {
    console.error('Error al inactivar grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al inactivar grupo',
      error: error.message
    });
  }
};

// Reactivar un grupo manualmente
exports.reactivarGrupo = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`
      UPDATE Grupo 
      SET estado = 'activo' 
      WHERE id_Grupo = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Grupo reactivado correctamente'
    });

  } catch (error) {
    console.error('Error al reactivar grupo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reactivar grupo',
      error: error.message
    });
  }
};

// Obtener historial de grupos inactivos
exports.getGruposInactivos = async (req, res) => {
  try {
    const [grupos] = await pool.query(`
      SELECT 
        g.id_Grupo,
        g.grupo,
        g.ubicacion,
        n.nivel as nivel_nombre,
        p.descripcion as periodo_nombre,
        p.fecha_inicio,
        p.fecha_fin,
        CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) as profesor_nombre,
        COUNT(DISTINCT ge.nControl) as total_alumnos
      FROM Grupo g
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      LEFT JOIN Periodo p ON g.id_Periodo = p.id_Periodo
      LEFT JOIN Profesor prof ON g.id_Profesor = prof.id_Profesor
      LEFT JOIN Empleado emp ON prof.id_empleado = emp.id_empleado
      LEFT JOIN DatosPersonales dp ON emp.id_dp = dp.id_dp
      LEFT JOIN GrupoEstudiante ge ON g.id_Grupo = ge.id_Grupo
      WHERE g.estado = 'inactivo'
      GROUP BY g.id_Grupo, g.grupo, g.ubicacion, n.nivel, p.descripcion, 
               p.fecha_inicio, p.fecha_fin, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre
      ORDER BY p.fecha_fin DESC
    `);

    res.json({
      success: true,
      grupos
    });

  } catch (error) {
    console.error('Error al obtener grupos inactivos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener grupos inactivos',
      error: error.message
    });
  }
};
