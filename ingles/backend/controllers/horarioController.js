const { pool } = require('../config/db');

// Obtener todos los horarios
exports.getHorarios = async (req, res) => {
  try {
    const [horarios] = await pool.query(`
      SELECT 
        id_cHorario,
        ubicacion,
        diaSemana,
        hora,
        estado
      FROM catalogohorarios
      ORDER BY ubicacion, diaSemana, hora
    `);

    res.json(horarios);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ 
      message: 'Error al obtener horarios', 
      error: error.message 
    });
  }
};

// Obtener un horario por ID
exports.getHorarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [horarios] = await pool.query(
      'SELECT * FROM catalogohorarios WHERE id_cHorario = ?',
      [id]
    );

    if (horarios.length === 0) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    res.json(horarios[0]);
  } catch (error) {
    console.error('Error al obtener horario:', error);
    res.status(500).json({ 
      message: 'Error al obtener horario', 
      error: error.message 
    });
  }
};

// Crear un nuevo horario
exports.createHorario = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { ubicacion, diaSemana, hora, estado } = req.body;

    // Validar campos requeridos
    if (!ubicacion || !diaSemana || !hora) {
      await connection.rollback();
      return res.status(400).json({ 
        message: 'Ubicación, día de la semana y hora son requeridos' 
      });
    }

    // Insertar horario
    const [result] = await connection.query(
      'INSERT INTO catalogohorarios (ubicacion, diaSemana, hora, estado) VALUES (?, ?, ?, ?)',
      [ubicacion, diaSemana, hora, estado || 'activo']
    );

    await connection.commit();

    res.status(201).json({
      message: 'Horario creado exitosamente',
      id_cHorario: result.insertId
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error al crear horario:', error);
    res.status(500).json({ 
      message: 'Error al crear horario', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Actualizar un horario
exports.updateHorario = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { ubicacion, diaSemana, hora, estado } = req.body;

    // Verificar que el horario existe
    const [horarios] = await connection.query(
      'SELECT id_cHorario FROM catalogohorarios WHERE id_cHorario = ?',
      [id]
    );

    if (horarios.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    // Actualizar horario
    await connection.query(
      'UPDATE catalogohorarios SET ubicacion = ?, diaSemana = ?, hora = ?, estado = ? WHERE id_cHorario = ?',
      [ubicacion, diaSemana, hora, estado || 'activo', id]
    );

    await connection.commit();

    res.json({ message: 'Horario actualizado exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ 
      message: 'Error al actualizar horario', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Eliminar un horario
exports.deleteHorario = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Verificar que el horario existe
    const [horarios] = await connection.query(
      'SELECT id_cHorario FROM catalogohorarios WHERE id_cHorario = ?',
      [id]
    );

    if (horarios.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    // Verificar si hay grupos usando este horario
    const [gruposConHorario] = await connection.query(
      'SELECT COUNT(*) as count FROM Grupo WHERE id_cHorario = ?',
      [id]
    );

    if (gruposConHorario[0].count > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        message: `No se puede eliminar el horario porque está asignado a ${gruposConHorario[0].count} grupo(s)` 
      });
    }

    // Eliminar horario
    await connection.query('DELETE FROM catalogohorarios WHERE id_cHorario = ?', [id]);

    await connection.commit();

    res.json({ message: 'Horario eliminado exitosamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ 
      message: 'Error al eliminar horario', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Cambiar estado de un horario (activo/inactivo)
exports.toggleEstadoHorario = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Obtener estado actual
    const [horarios] = await connection.query(
      'SELECT estado FROM catalogohorarios WHERE id_cHorario = ?',
      [id]
    );

    if (horarios.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    const nuevoEstado = horarios[0].estado === 'activo' ? 'inactivo' : 'activo';

    // Actualizar estado
    await connection.query(
      'UPDATE catalogohorarios SET estado = ? WHERE id_cHorario = ?',
      [nuevoEstado, id]
    );

    await connection.commit();

    res.json({ 
      message: 'Estado del horario actualizado exitosamente',
      nuevoEstado 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error al cambiar estado del horario:', error);
    res.status(500).json({ 
      message: 'Error al cambiar estado del horario', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};
