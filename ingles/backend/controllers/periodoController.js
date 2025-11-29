const { pool } = require('../config/db');

// Obtener todos los periodos
exports.getPeriodos = async (req, res) => {
  try {
    const [periodos] = await pool.query(`
      SELECT 
        id_Periodo,
        descripcion,
        año
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

module.exports = exports;
