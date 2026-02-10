const { pool } = require('../config/db');

// Obtener todos los periodos
exports.getPeriodos = async (req, res) => {
  try {
    const [periodos] = await pool.query(`
      SELECT 
        id_Periodo,
        descripcion,
        año,
        fecha_inicio,
        fecha_fin
      FROM Periodo
      ORDER BY año DESC, id_Periodo DESC
    `);

    res.json(periodos);
  } catch (error) {
    console.error('Error al obtener periodos:', error);
    res.status(500).json({ 
      message: 'Error al obtener periodos', 
      error: error.message 
    });
  }
};

// Obtener un periodo por ID
exports.getPeriodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [periodos] = await pool.query(
      'SELECT id_Periodo, descripcion, año FROM Periodo WHERE id_Periodo = ?',
      [id]
    );

    if (periodos.length === 0) {
      return res.status(404).json({ message: 'Periodo no encontrado' });
    }

    res.json(periodos[0]);
  } catch (error) {
    console.error('Error al obtener periodo:', error);
    res.status(500).json({ 
      message: 'Error al obtener periodo', 
      error: error.message 
    });
  }
};

// Crear un nuevo periodo
exports.createPeriodo = async (req, res) => {
  try {
    const { descripcion, año, fecha_inicio, fecha_fin } = req.body;

    // Validaciones
    if (!descripcion || !año || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos los campos son obligatorios (descripcion, año, fecha_inicio, fecha_fin)' 
      });
    }

    // Verificar que el periodo no exista ya
    const [existente] = await pool.query(
      'SELECT id_Periodo FROM Periodo WHERE descripcion = ?',
      [descripcion]
    );

    if (existente.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Ya existe un periodo con esa descripción' 
      });
    }

    // Obtener el siguiente ID disponible
    const [maxId] = await pool.query('SELECT COALESCE(MAX(id_Periodo), 0) + 1 as nextId FROM Periodo');
    const nuevoId = maxId[0].nextId;

    // Insertar el periodo con el ID calculado
    await pool.query(
      'INSERT INTO Periodo (id_Periodo, descripcion, año, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)',
      [nuevoId, descripcion, parseInt(año), fecha_inicio, fecha_fin]
    );

    // Obtener el periodo creado
    const [nuevoPeriodo] = await pool.query(
      'SELECT id_Periodo, descripcion, año, fecha_inicio, fecha_fin FROM Periodo WHERE id_Periodo = ?',
      [nuevoId]
    );

    res.status(201).json({ 
      success: true,
      message: 'Periodo creado correctamente',
      periodo: nuevoPeriodo[0]
    });
  } catch (error) {
    console.error('Error al crear periodo:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear periodo', 
      error: error.message 
    });
  }
};

// Eliminar un periodo
exports.deletePeriodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el periodo exista
    const [periodo] = await pool.query(
      'SELECT id_Periodo FROM Periodo WHERE id_Periodo = ?',
      [id]
    );

    if (periodo.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Periodo no encontrado' 
      });
    }

    // Verificar si hay grupos asociados
    const [grupos] = await pool.query(
      'SELECT COUNT(*) as total FROM Grupo WHERE id_Periodo = ?',
      [id]
    );

    if (grupos[0].total > 0) {
      return res.status(400).json({ 
        success: false,
        message: `No se puede eliminar el periodo porque tiene ${grupos[0].total} grupo(s) asociado(s)` 
      });
    }

    // Eliminar el periodo
    await pool.query('DELETE FROM Periodo WHERE id_Periodo = ?', [id]);

    res.json({ 
      success: true,
      message: 'Periodo eliminado correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar periodo:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar periodo', 
      error: error.message 
    });
  }
};

// Actualizar un periodo
exports.updatePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, año, fecha_inicio, fecha_fin } = req.body;

    // Validaciones
    if (!descripcion || !año || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos los campos son obligatorios (descripcion, año, fecha_inicio, fecha_fin)' 
      });
    }

    // Verificar que el periodo exista
    const [periodo] = await pool.query(
      'SELECT id_Periodo FROM Periodo WHERE id_Periodo = ?',
      [id]
    );

    if (periodo.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Periodo no encontrado' 
      });
    }

    // Verificar que no exista otro periodo con la misma descripción
    const [existente] = await pool.query(
      'SELECT id_Periodo FROM Periodo WHERE descripcion = ? AND id_Periodo != ?',
      [descripcion, id]
    );

    if (existente.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Ya existe otro periodo con esa descripción' 
      });
    }

    // Actualizar el periodo
    await pool.query(
      'UPDATE Periodo SET descripcion = ?, año = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_Periodo = ?',
      [descripcion, parseInt(año), fecha_inicio, fecha_fin, id]
    );

    // Obtener el periodo actualizado
    const [periodoActualizado] = await pool.query(
      'SELECT id_Periodo, descripcion, año, fecha_inicio, fecha_fin FROM Periodo WHERE id_Periodo = ?',
      [id]
    );

    res.json({ 
      success: true,
      message: 'Periodo actualizado correctamente',
      periodo: periodoActualizado[0]
    });
  } catch (error) {
    console.error('Error al actualizar periodo:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar periodo', 
      error: error.message 
    });
  }
};

module.exports = exports;
