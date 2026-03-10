const { pool } = require('../config/db');

// Obtener todos los niveles
exports.getNiveles = async (req, res) => {
  try {
    const [niveles] = await pool.query(`
      SELECT 
        id_Nivel,
        nivel,
        campus
      FROM Nivel
      ORDER BY 
        CASE campus 
          WHEN 'Tecnologico' THEN 1 
          WHEN 'Centro de Idiomas' THEN 2 
        END,
        id_Nivel
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

// Obtener niveles por campus
exports.getNivelesByCampus = async (req, res) => {
  try {
    const { campus } = req.params;
    
    // Validar que el campus sea válido
    if (!['Tecnologico', 'Centro de Idiomas'].includes(campus)) {
      return res.status(400).json({ 
        message: 'Campus inválido. Debe ser "Tecnologico" o "Centro de Idiomas"' 
      });
    }
    
    // Usar FIND_IN_SET para buscar en SET
    const [niveles] = await pool.query(`
      SELECT 
        id_Nivel,
        nivel,
        campus
      FROM Nivel
      WHERE FIND_IN_SET(?, campus) > 0
      ORDER BY id_Nivel
    `, [campus]);

    res.json(niveles);
  } catch (error) {
    console.error('Error al obtener niveles por campus:', error);
    res.status(500).json({ 
      message: 'Error al obtener niveles por campus', 
      error: error.message 
    });
  }
};

// Obtener un nivel por ID
exports.getNivelById = async (req, res) => {
  try {
    const { id } = req.params;
    const [niveles] = await pool.query(
      'SELECT id_Nivel, nivel, campus FROM Nivel WHERE id_Nivel = ?',
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
