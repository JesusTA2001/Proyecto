const { pool } = require('../config/db');

// Obtener todos los grupos con información relacionada
exports.getGrupos = async (req, res) => {
  try {
    const [grupos] = await pool.query(`
      SELECT 
        g.id_Grupo,
        g.grupo,
        g.id_Periodo,
        g.id_Profesor,
        g.id_Nivel,
        g.ubicacion,
        g.id_cHorario,
        p.id_Profesor as profesor_id,
        CONCAT(dp_prof.apellidoPaterno, ' ', dp_prof.apellidoMaterno, ' ', dp_prof.nombre) as profesor_nombre,
        ch.diaSemana,
        ch.hora,
        ch.estado as horario_estado,
        n.nivel as nivel_nombre,
        (SELECT COUNT(*) FROM EstudianteGrupo eg WHERE eg.id_Grupo = g.id_Grupo) as num_alumnos
      FROM Grupo g
      LEFT JOIN Profesor p ON g.id_Profesor = p.id_Profesor
      LEFT JOIN Empleado e ON p.id_empleado = e.id_empleado
      LEFT JOIN DatosPersonales dp_prof ON e.id_dp = dp_prof.id_dp
      LEFT JOIN catalogohorarios ch ON g.id_cHorario = ch.id_cHorario
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      WHERE g.estado = 'activo'
      ORDER BY g.id_Grupo
    `);

    // Para cada grupo, obtener los alumnos asignados (solo los actuales)
    for (let grupo of grupos) {
      const [alumnos] = await pool.query(`
        SELECT 
          eg.nControl,
          eg.estado as estado_en_grupo,
          CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) as nombre_completo,
          dp.email,
          e.ubicacion
        FROM EstudianteGrupo eg
        JOIN Estudiante e ON eg.nControl = e.nControl
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE eg.id_Grupo = ? AND eg.estado = 'actual'
        ORDER BY dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre
      `, [grupo.id_Grupo]);
      
      grupo.alumnoIds = alumnos.map(a => a.nControl);
      grupo.alumnos = alumnos;
    }

    res.json(grupos);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({ 
      message: 'Error al obtener grupos', 
      error: error.message 
    });
  }
};

// Obtener un grupo por ID
exports.getGrupoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [grupos] = await pool.query(`
      SELECT 
        g.id_Grupo,
        g.grupo,
        g.id_Periodo,
        g.id_Profesor,
        g.id_Nivel,
        g.ubicacion,
        g.id_cHorario,
        p.id_Profesor as profesor_id,
        CONCAT(dp_prof.apellidoPaterno, ' ', dp_prof.apellidoMaterno, ' ', dp_prof.nombre) as profesor_nombre,
        ch.diaSemana,
        ch.hora,
        ch.estado as horario_estado,
        n.nivel as nivel_nombre
      FROM Grupo g
      LEFT JOIN Profesor p ON g.id_Profesor = p.id_Profesor
      LEFT JOIN Empleado e ON p.id_empleado = e.id_empleado
      LEFT JOIN DatosPersonales dp_prof ON e.id_dp = dp_prof.id_dp
      LEFT JOIN catalogohorarios ch ON g.id_cHorario = ch.id_cHorario
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      WHERE g.id_Grupo = ?
    `, [id]);

    if (grupos.length === 0) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    res.json(grupos[0]);
  } catch (error) {
    console.error('Error al obtener grupo:', error);
    res.status(500).json({ 
      message: 'Error al obtener grupo', 
      error: error.message 
    });
  }
};

// Crear un nuevo grupo
exports.createGrupo = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { grupo, id_Periodo, id_Profesor, id_Nivel, ubicacion, id_cHorario, dia, horaInicio, horaFin, alumnoIds } = req.body;

    // Validar campos requeridos básicos
    if (!grupo || !ubicacion) {
      await connection.rollback();
      return res.status(400).json({ 
        message: 'Faltan campos requeridos (grupo, ubicacion)' 
      });
    }

    // Valores por defecto
    const periodoFinal = id_Periodo || 1;
    const nivelFinal = id_Nivel || 1;
    let horarioFinal = id_cHorario;

    // Si no se proporciona id_cHorario pero se tienen día y horas, buscar o crear el horario
    if (!horarioFinal && dia && horaInicio && horaFin) {
      const horaCompleta = `${horaInicio}-${horaFin}`;
      
      // Buscar horario existente
      const [horarioExistente] = await connection.query(
        'SELECT id_cHorario FROM catalogohorarios WHERE ubicacion = ? AND diaSemana = ? AND hora = ? AND estado = ?',
        [ubicacion, dia, horaCompleta, 'activo']
      );

      if (horarioExistente.length > 0) {
        horarioFinal = horarioExistente[0].id_cHorario;
      } else {
        // Crear nuevo horario
        const [nuevoHorario] = await connection.query(
          'INSERT INTO catalogohorarios (ubicacion, diaSemana, hora, estado) VALUES (?, ?, ?, ?)',
          [ubicacion, dia, horaCompleta, 'activo']
        );
        horarioFinal = nuevoHorario.insertId;
      }
    }

    // Si aún no hay horario, usar null
    if (!horarioFinal) {
      horarioFinal = null;
    }

    // Insertar grupo
    const [result] = await connection.query(
      'INSERT INTO Grupo (grupo, id_Periodo, id_Profesor, id_Nivel, ubicacion, id_cHorario) VALUES (?, ?, ?, ?, ?, ?)',
      [grupo, periodoFinal, id_Profesor || null, nivelFinal, ubicacion, horarioFinal]
    );

    const nuevoGrupoId = result.insertId;

    // Si se proporcionaron alumnos, agregarlos al grupo
    if (alumnoIds && Array.isArray(alumnoIds) && alumnoIds.length > 0) {
      for (const nControl of alumnoIds) {
        await connection.query(
          'INSERT INTO EstudianteGrupo (nControl, id_Grupo, estado) VALUES (?, ?, ?)',
          [nControl, nuevoGrupoId, 'actual']
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      message: 'Grupo creado exitosamente',
      id_Grupo: nuevoGrupoId
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error al crear grupo:', error);
    res.status(500).json({ 
      message: 'Error al crear grupo', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Actualizar un grupo
exports.updateGrupo = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { grupo, id_Periodo, id_Profesor, id_Nivel, ubicacion, id_cHorario, dia, horaInicio, horaFin } = req.body;

    // Verificar que el grupo existe
    const [grupos] = await connection.query(
      'SELECT id_Grupo FROM Grupo WHERE id_Grupo = ?',
      [id]
    );

    if (grupos.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    // Si se proporcionan día y horas, buscar o crear el horario (independientemente de si ya tiene id_cHorario)
    let horarioFinal = id_cHorario;
    if (dia && horaInicio && horaFin) {
      const horaCompleta = `${horaInicio}-${horaFin}`;
      
      // Buscar horario existente
      const [horarioExistente] = await connection.query(
        'SELECT id_cHorario FROM catalogohorarios WHERE ubicacion = ? AND diaSemana = ? AND hora = ? AND estado = ?',
        [ubicacion, dia, horaCompleta, 'activo']
      );

      if (horarioExistente.length > 0) {
        horarioFinal = horarioExistente[0].id_cHorario;
      } else {
        // Crear nuevo horario
        const [nuevoHorario] = await connection.query(
          'INSERT INTO catalogohorarios (ubicacion, diaSemana, hora, estado) VALUES (?, ?, ?, ?)',
          [ubicacion, dia, horaCompleta, 'activo']
        );
        horarioFinal = nuevoHorario.insertId;
      }
    }

    // Actualizar grupo
    await connection.query(
      'UPDATE Grupo SET grupo = ?, id_Periodo = ?, id_Profesor = ?, id_Nivel = ?, ubicacion = ?, id_cHorario = ? WHERE id_Grupo = ?',
      [grupo, id_Periodo, id_Profesor || null, id_Nivel, ubicacion, horarioFinal, id]
    );

    await connection.commit();

    res.json({ message: 'Grupo actualizado exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar grupo:', error);
    res.status(500).json({ 
      message: 'Error al actualizar grupo', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Eliminar un grupo
exports.deleteGrupo = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Verificar que el grupo existe
    const [grupos] = await connection.query(
      'SELECT id_Grupo FROM Grupo WHERE id_Grupo = ?',
      [id]
    );

    if (grupos.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    // Primero eliminar todos los estudiantes asignados al grupo
    await connection.query('DELETE FROM EstudianteGrupo WHERE id_Grupo = ?', [id]);

    // Luego eliminar el grupo
    await connection.query('DELETE FROM Grupo WHERE id_Grupo = ?', [id]);

    await connection.commit();

    res.json({ message: 'Grupo eliminado exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar grupo:', error);
    res.status(500).json({ 
      message: 'Error al eliminar grupo', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Agregar alumnos a un grupo
exports.agregarAlumnos = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { alumnoIds } = req.body;

    if (!Array.isArray(alumnoIds)) {
      await connection.rollback();
      return res.status(400).json({ message: 'Se requiere un array de IDs de alumnos' });
    }

    // Verificar que el grupo existe
    const [grupos] = await connection.query('SELECT id_Grupo FROM Grupo WHERE id_Grupo = ?', [id]);
    if (grupos.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    // Eliminar asignaciones existentes del grupo
    await connection.query('DELETE FROM EstudianteGrupo WHERE id_Grupo = ?', [id]);

    // Insertar nuevas asignaciones si hay alumnos
    if (alumnoIds.length > 0) {
      for (const nControl of alumnoIds) {
        await connection.query(
          'INSERT INTO EstudianteGrupo (nControl, id_Grupo, estado) VALUES (?, ?, ?)',
          [nControl, id, 'actual']
        );
      }
    }

    await connection.commit();
    res.json({ message: 'Alumnos actualizados exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al agregar alumnos:', error);
    res.status(500).json({ message: 'Error al agregar alumnos', error: error.message });
  } finally {
    connection.release();
  }
};

// Quitar un alumno de un grupo
exports.quitarAlumno = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id, nControl } = req.params;

    await connection.query(
      'DELETE FROM EstudianteGrupo WHERE id_Grupo = ? AND nControl = ?',
      [id, nControl]
    );

    await connection.commit();
    res.json({ message: 'Alumno removido del grupo exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al quitar alumno:', error);
    res.status(500).json({ message: 'Error al quitar alumno', error: error.message });
  } finally {
    connection.release();
  }
};

// Obtener historial de grupos finalizados
exports.getHistorialGrupos = async (req, res) => {
  try {
    const { id_Periodo } = req.query;
    
    let query = `
      SELECT 
        g.id_Grupo,
        g.grupo,
        g.id_Periodo,
        g.id_Profesor,
        g.id_Nivel,
        g.ubicacion,
        g.id_cHorario,
        g.estado,
        per.descripcion as periodo_descripcion,
        per.año as periodo_año,
        CONCAT(dp_prof.apellidoPaterno, ' ', dp_prof.apellidoMaterno, ' ', dp_prof.nombre) as profesor_nombre,
        ch.diaSemana,
        ch.hora,
        n.nivel as nivel_nombre,
        (SELECT COUNT(*) FROM EstudianteGrupo eg WHERE eg.id_Grupo = g.id_Grupo) as num_alumnos
      FROM Grupo g
      LEFT JOIN Periodo per ON g.id_Periodo = per.id_Periodo
      LEFT JOIN Profesor p ON g.id_Profesor = p.id_Profesor
      LEFT JOIN Empleado e ON p.id_empleado = e.id_empleado
      LEFT JOIN DatosPersonales dp_prof ON e.id_dp = dp_prof.id_dp
      LEFT JOIN catalogohorarios ch ON g.id_cHorario = ch.id_cHorario
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      WHERE g.estado = 'concluido'
    `;
    
    const params = [];
    if (id_Periodo) {
      query += ' AND g.id_Periodo = ?';
      params.push(id_Periodo);
    }
    
    query += ' ORDER BY per.año DESC, g.id_Grupo DESC';
    
    const [grupos] = await pool.query(query, params);

    // Para cada grupo, obtener los alumnos (incluidos los históricos)
    for (let grupo of grupos) {
      const [alumnos] = await pool.query(`
        SELECT 
          eg.nControl,
          eg.estado as estado_en_grupo,
          CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) as nombre_completo,
          dp.email,
          e.ubicacion
        FROM EstudianteGrupo eg
        JOIN Estudiante e ON eg.nControl = e.nControl
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE eg.id_Grupo = ?
        ORDER BY dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre
      `, [grupo.id_Grupo]);
      
      grupo.alumnos = alumnos;
    }

    res.json({
      success: true,
      grupos: grupos
    });
  } catch (error) {
    console.error('Error al obtener historial de grupos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener historial de grupos', 
      error: error.message 
    });
  }
};
