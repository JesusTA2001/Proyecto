const { pool } = require('../config/db');

// Registrar asistencia (solo cuando el estudiante asiste)
exports.registrarAsistencia = async (req, res) => {
  try {
    const { id_Grupo, nControl, fecha } = req.body;

    // Validar datos
    if (!id_Grupo || !nControl || !fecha) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos (id_Grupo, nControl, fecha)' 
      });
    }

    // Verificar si ya existe un registro para este alumno en esta fecha y grupo
    const [existe] = await pool.query(
      'SELECT id_asistencia FROM Asistencia WHERE id_Grupo = ? AND nControl = ? AND fecha = ?',
      [id_Grupo, nControl, fecha]
    );

    if (existe.length > 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'Asistencia ya registrada',
        id_asistencia: existe[0].id_asistencia
      });
    }

    // Insertar nuevo registro de asistencia
    const [result] = await pool.query(
      'INSERT INTO Asistencia (id_Grupo, nControl, fecha) VALUES (?, ?, ?)',
      [id_Grupo, nControl, fecha]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Asistencia registrada con éxito',
      id_asistencia: result.insertId
    });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar asistencia', 
      error: error.message 
    });
  }
};

// Eliminar asistencia (cuando se marca como ausente o se desmarca)
exports.eliminarAsistencia = async (req, res) => {
  try {
    const { id_Grupo, nControl, fecha } = req.body;

    if (!id_Grupo || !nControl || !fecha) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos (id_Grupo, nControl, fecha)' 
      });
    }

    const [result] = await pool.query(
      'DELETE FROM Asistencia WHERE id_Grupo = ? AND nControl = ? AND fecha = ?',
      [id_Grupo, nControl, fecha]
    );

    res.json({ 
      success: true, 
      message: 'Asistencia eliminada',
      rowsAffected: result.affectedRows
    });
  } catch (error) {
    console.error('Error al eliminar asistencia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar asistencia', 
      error: error.message 
    });
  }
};

// Guardar asistencias masivas (optimizado para guardar toda la lista de una vez)
exports.guardarAsistenciasMasivas = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id_Grupo, fecha, asistencias } = req.body;
    // asistencias es un array de objetos: [{ nControl, presente: true/false }, ...]

    if (!id_Grupo || !fecha || !Array.isArray(asistencias)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos (id_Grupo, fecha, asistencias[])' 
      });
    }

    await connection.beginTransaction();

    // Primero, eliminar todas las asistencias existentes para este grupo y fecha
    await connection.query(
      'DELETE FROM Asistencia WHERE id_Grupo = ? AND fecha = ?',
      [id_Grupo, fecha]
    );

    // Luego, insertar solo los que están presentes
    const presentes = asistencias.filter(a => a.presente);
    
    if (presentes.length > 0) {
      const values = presentes.map(a => [id_Grupo, a.nControl, fecha]);
      await connection.query(
        'INSERT INTO Asistencia (id_Grupo, nControl, fecha) VALUES ?',
        [values]
      );
    }

    await connection.commit();

    res.json({ 
      success: true, 
      message: 'Asistencias guardadas con éxito',
      totalPresentes: presentes.length,
      totalAusentes: asistencias.length - presentes.length
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al guardar asistencias masivas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar asistencias', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Obtener asistencias de un grupo en una fecha específica
exports.obtenerAsistenciasPorGrupoFecha = async (req, res) => {
  try {
    const { id_Grupo, fecha } = req.query;

    if (!id_Grupo || !fecha) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan parámetros (id_Grupo, fecha)' 
      });
    }

    const [asistencias] = await pool.query(
      'SELECT nControl FROM Asistencia WHERE id_Grupo = ? AND fecha = ?',
      [id_Grupo, fecha]
    );

    // Retornar array de números de control que asistieron
    res.json({ 
      success: true, 
      fecha,
      id_Grupo: parseInt(id_Grupo),
      presentes: asistencias.map(a => a.nControl)
    });
  } catch (error) {
    console.error('Error al obtener asistencias:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener asistencias', 
      error: error.message 
    });
  }
};

// Obtener estadísticas de asistencia de un grupo
exports.obtenerEstadisticasGrupo = async (req, res) => {
  try {
    const { id_Grupo } = req.params;

    if (!id_Grupo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Falta id_Grupo' 
      });
    }

    // Total de alumnos en el grupo
    const [totalAlumnos] = await pool.query(
      'SELECT COUNT(*) as total FROM EstudianteGrupo WHERE id_Grupo = ? AND estado = "actual"',
      [id_Grupo]
    );

    // Total de registros de asistencia (todas las fechas)
    const [totalAsistencias] = await pool.query(
      'SELECT COUNT(*) as total FROM Asistencia WHERE id_Grupo = ?',
      [id_Grupo]
    );

    // Asistencias por fecha
    const [asistenciasPorFecha] = await pool.query(
      `SELECT fecha, COUNT(*) as presentes 
       FROM Asistencia 
       WHERE id_Grupo = ? 
       GROUP BY fecha 
       ORDER BY fecha DESC`,
      [id_Grupo]
    );

    // Asistencias por alumno
    const [asistenciasPorAlumno] = await pool.query(
      `SELECT e.nControl, 
              dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno,
              COUNT(ast.id_asistencia) as totalAsistencias
       FROM EstudianteGrupo eg
       JOIN Estudiante e ON eg.nControl = e.nControl
       JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
       LEFT JOIN Asistencia ast ON ast.nControl = e.nControl AND ast.id_Grupo = eg.id_Grupo
       WHERE eg.id_Grupo = ? AND eg.estado = 'actual'
       GROUP BY e.nControl, dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno
       ORDER BY dp.apellidoPaterno, dp.apellidoMaterno`,
      [id_Grupo]
    );

    res.json({ 
      success: true,
      totalAlumnos: totalAlumnos[0].total,
      totalAsistencias: totalAsistencias[0].total,
      asistenciasPorFecha,
      asistenciasPorAlumno
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estadísticas', 
      error: error.message 
    });
  }
};

// Obtener historial de asistencias de un alumno
exports.obtenerHistorialAlumno = async (req, res) => {
  try {
    const { nControl } = req.params;

    if (!nControl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Falta nControl' 
      });
    }

    const [historial] = await pool.query(
      `SELECT a.id_asistencia, a.fecha, 
              g.grupo as nombreGrupo, g.ubicacion,
              n.nivel as nombreNivel
       FROM Asistencia a
       JOIN Grupo g ON a.id_Grupo = g.id_Grupo
       JOIN Nivel n ON g.id_Nivel = n.id_Nivel
       WHERE a.nControl = ?
       ORDER BY a.fecha DESC`,
      [nControl]
    );

    res.json({ 
      success: true,
      nControl: parseInt(nControl),
      totalAsistencias: historial.length,
      historial
    });
  } catch (error) {
    console.error('Error al obtener historial del alumno:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener historial', 
      error: error.message 
    });
  }
};
