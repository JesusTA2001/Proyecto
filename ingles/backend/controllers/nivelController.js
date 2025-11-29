const { pool } = require('../config/db');

// Obtener todos los niveles
exports.getNiveles = async (req, res) => {
  try {
    const [niveles] = await pool.query(`
      SELECT 
        id_Nivel,
        nivel
      FROM Nivel
      ORDER BY id_Nivel
    `);

    res.json(niveles);
  } catch (error) {
    console.error('Error al obtener niveles:', error);
    res.status(500).json({ 
      message: 'Error al obtener niveles', 
      error: error.message 
    });
  }
};

// Obtener un nivel por ID
exports.getNivelById = async (req, res) => {
  try {
    const { id } = req.params;
    const [niveles] = await pool.query(
      'SELECT id_Nivel, nivel FROM Nivel WHERE id_Nivel = ?',
      [id]
    );

    if (niveles.length === 0) {
      return res.status(404).json({ message: 'Nivel no encontrado' });
    }

    res.json(niveles[0]);
  } catch (error) {
    console.error('Error al obtener nivel:', error);
    res.status(500).json({ 
      message: 'Error al obtener nivel', 
      error: error.message 
    });
  }
};

module.exports = exports;
