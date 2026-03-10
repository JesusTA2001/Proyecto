const { pool } = require('../config/db');

// ========================================
// CATÁLOGO DE ESTUDIOS
// ========================================

// Obtener catálogo de niveles de estudio
exports.getCatalogoEstudios = async (req, res) => {
  try {
    const [niveles] = await pool.query(`
      SELECT id_Estudio, nivelEstudio 
      FROM CatalogoEstudios 
      ORDER BY id_Estudio
    `);
    
    res.json(niveles);
  } catch (error) {
    console.error('Error al obtener catálogo de estudios:', error);
    res.status(500).json({ message: 'Error al obtener catálogo de estudios', error: error.message });
  }
};

// ========================================
// PREPARACIÓN ACADÉMICA (ESTUDIOS DE PROFESORES)
// ========================================

// Obtener todos los estudios de un profesor
exports.getEstudiosProfesor = async (req, res) => {
  try {
    const { id } = req.params; // id_Profesor
    
    const [estudios] = await pool.query(`
      SELECT 
        p.id_prep,
        p.id_Profesor,
        p.id_Estudio,
        ce.nivelEstudio,
        p.titulo,
        p.institucion,
        p.año_obtencion,
        p.created_at
      FROM Preparacion p
      JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
      WHERE p.id_Profesor = ?
      ORDER BY 
        CASE ce.id_Estudio 
          WHEN 3 THEN 1  -- Doctorado
          WHEN 2 THEN 2  -- Maestría
          WHEN 1 THEN 3  -- Licenciatura
          WHEN 5 THEN 4  -- Especialidad
          WHEN 4 THEN 5  -- Diplomado
          WHEN 6 THEN 6  -- Técnico
          ELSE 7
        END,
        p.año_obtencion DESC
    `, [id]);
    
    res.json(estudios);
  } catch (error) {
    console.error('Error al obtener estudios del profesor:', error);
    res.status(500).json({ message: 'Error al obtener estudios del profesor', error: error.message });
  }
};

// Agregar un estudio a un profesor
exports.createEstudioProfesor = async (req, res) => {
  try {
    const { id } = req.params; // id_Profesor
    const { id_Estudio, titulo, institucion, año_obtencion } = req.body;
    
    // Validaciones
    if (!id_Estudio || !titulo) {
      return res.status(400).json({ message: 'El nivel de estudio y el título son obligatorios' });
    }
    
    const [result] = await pool.query(`
      INSERT INTO Preparacion (id_Profesor, id_Estudio, titulo, institucion, año_obtencion)
      VALUES (?, ?, ?, ?, ?)
    `, [id, id_Estudio, titulo, institucion || null, año_obtencion || null]);
    
    // Obtener el estudio recién creado
    const [nuevoEstudio] = await pool.query(`
      SELECT 
        p.id_prep,
        p.id_Profesor,
        p.id_Estudio,
        ce.nivelEstudio,
        p.titulo,
        p.institucion,
        p.año_obtencion,
        p.created_at
      FROM Preparacion p
      JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
      WHERE p.id_prep = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Estudio agregado exitosamente',
      estudio: nuevoEstudio[0]
    });
  } catch (error) {
    console.error('Error al crear estudio:', error);
    res.status(500).json({ message: 'Error al crear estudio', error: error.message });
  }
};

// Actualizar un estudio
exports.updateEstudio = async (req, res) => {
  try {
    const { id } = req.params; // id_prep
    const { id_Estudio, titulo, institucion, año_obtencion } = req.body;
    
    // Validaciones
    if (!id_Estudio || !titulo) {
      return res.status(400).json({ message: 'El nivel de estudio y el título son obligatorios' });
    }
    
    const [result] = await pool.query(`
      UPDATE Preparacion 
      SET id_Estudio = ?, titulo = ?, institucion = ?, año_obtencion = ?
      WHERE id_prep = ?
    `, [id_Estudio, titulo, institucion || null, año_obtencion || null, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }
    
    // Obtener el estudio actualizado
    const [estudioActualizado] = await pool.query(`
      SELECT 
        p.id_prep,
        p.id_Profesor,
        p.id_Estudio,
        ce.nivelEstudio,
        p.titulo,
        p.institucion,
        p.año_obtencion,
        p.created_at
      FROM Preparacion p
      JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
      WHERE p.id_prep = ?
    `, [id]);
    
    res.json({
      success: true,
      message: 'Estudio actualizado exitosamente',
      estudio: estudioActualizado[0]
    });
  } catch (error) {
    console.error('Error al actualizar estudio:', error);
    res.status(500).json({ message: 'Error al actualizar estudio', error: error.message });
  }
};

// Eliminar un estudio
exports.deleteEstudio = async (req, res) => {
  try {
    const { id } = req.params; // id_prep
    
    const [result] = await pool.query(`
      DELETE FROM Preparacion WHERE id_prep = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }
    
    res.json({
      success: true,
      message: 'Estudio eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar estudio:', error);
    res.status(500).json({ message: 'Error al eliminar estudio', error: error.message });
  }
};

module.exports = exports;
