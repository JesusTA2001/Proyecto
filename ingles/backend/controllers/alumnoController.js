const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

// Obtener todos los alumnos
exports.getAlumnos = async (req, res) => {
  try {
    const [alumnos] = await pool.query(`
      SELECT e.nControl, e.estado, e.ubicacion, e.id_Nivel,
             n.nivel as nivel_nombre,
             dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre,
             dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
      FROM Estudiante e
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      LEFT JOIN Nivel n ON e.id_Nivel = n.id_Nivel
      ORDER BY dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre
    `);
    
    res.json(alumnos);
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({ message: 'Error al obtener alumnos', error: error.message });
  }
};

// Obtener alumnos disponibles (sin grupo asignado) - NUEVO
exports.getAlumnosDisponibles = async (req, res) => {
  try {
    const { ubicacion, nivel } = req.query;
    
    let query = `
      SELECT e.nControl, e.estado, e.ubicacion, e.id_Nivel,
             n.nivel as nivel_nombre,
             dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre,
             dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
      FROM Estudiante e
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      LEFT JOIN Nivel n ON e.id_Nivel = n.id_Nivel
      WHERE e.estado = 'activo'
        AND NOT EXISTS (
          SELECT 1 FROM EstudianteGrupo eg 
          WHERE eg.nControl = e.nControl 
          AND eg.estado = 'actual'
        )
    `;
    
    const params = [];
    
    if (ubicacion) {
      query += ' AND e.ubicacion = ?';
      params.push(ubicacion);
    }
    
    if (nivel) {
      query += ' AND e.id_Nivel = ?';
      params.push(nivel);
    }
    
    query += ' ORDER BY dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre';
    
    const [alumnos] = await pool.query(query, params);
    
    res.json(alumnos);
  } catch (error) {
    console.error('Error al obtener alumnos disponibles:', error);
    res.status(500).json({ message: 'Error al obtener alumnos disponibles', error: error.message });
  }
};

// Obtener un alumno por nControl
exports.getAlumnoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [alumnos] = await pool.query(`
      SELECT e.nControl, e.estado, e.ubicacion,
             dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre,
             dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
      FROM Estudiante e
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE e.nControl = ?
    `, [id]);

    if (alumnos.length === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    res.json(alumnos[0]);
  } catch (error) {
    console.error('Error al obtener alumno:', error);
    res.status(500).json({ message: 'Error al obtener alumno', error: error.message });
  }
};

// Crear alumno
exports.createAlumno = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      apellidoPaterno,
      apellidoMaterno,
      nombre,
      email,
      genero,
      CURP,
      telefono,
      direccion,
      ubicacion,
      usuario,
      contraseña
    } = req.body;

    // 1. Insertar datos personales
    const [dpResult] = await connection.query(
      `INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion]
    );

    const id_dp = dpResult.insertId;

    // 2. Generar número de control
    const nControl = ubicacion === 'Tecnologico'
      ? parseInt(`21${Math.floor(10000 + Math.random() * 90000)}`)
      : parseInt(`22${Math.floor(10000 + Math.random() * 90000)}`);

    // 3. Insertar estudiante
    await connection.query(
      `INSERT INTO Estudiante (nControl, id_dp, estado, ubicacion)
       VALUES (?, ?, 'activo', ?)`,
      [nControl, id_dp, ubicacion]
    );

    // 4. Crear usuario si se proporcionó
    if (usuario && contraseña) {
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      await connection.query(
        `INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion)
         VALUES (?, ?, 'ESTUDIANTE', ?)`,
        [usuario, hashedPassword, nControl]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Alumno creado exitosamente',
      nControl,
      id_dp
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear alumno:', error);
    res.status(500).json({ message: 'Error al crear alumno', error: error.message });
  } finally {
    connection.release();
  }
};

// Actualizar alumno
exports.updateAlumno = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const {
      apellidoPaterno,
      apellidoMaterno,
      nombre,
      email,
      genero,
      CURP,
      telefono,
      direccion,
      ubicacion,
      estado
    } = req.body;

    // 1. Obtener id_dp del estudiante
    const [estudiante] = await connection.query(
      'SELECT id_dp FROM Estudiante WHERE nControl = ?',
      [id]
    );

    if (estudiante.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    const id_dp = estudiante[0].id_dp;

    // 2. Actualizar datos personales
    await connection.query(
      `UPDATE DatosPersonales 
       SET apellidoPaterno = ?, apellidoMaterno = ?, nombre = ?, 
           email = ?, genero = ?, CURP = ?, telefono = ?, direccion = ?
       WHERE id_dp = ?`,
      [apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion, id_dp]
    );

    // 3. Actualizar estudiante
    await connection.query(
      `UPDATE Estudiante 
       SET ubicacion = ?, estado = ?
       WHERE nControl = ?`,
      [ubicacion, estado, id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Alumno actualizado exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar alumno:', error);
    res.status(500).json({ message: 'Error al actualizar alumno', error: error.message });
  } finally {
    connection.release();
  }
};

// Eliminar alumno
exports.deleteAlumno = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // 1. Obtener id_dp del estudiante
    const [estudiante] = await connection.query(
      'SELECT id_dp FROM Estudiante WHERE nControl = ?',
      [id]
    );

    if (estudiante.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    const id_dp = estudiante[0].id_dp;

    // 2. Eliminar usuario asociado
    await connection.query(
      'DELETE FROM Usuarios WHERE rol = "ESTUDIANTE" AND id_relacion = ?',
      [id]
    );

    // 3. Eliminar de EstudianteGrupo
    await connection.query('DELETE FROM EstudianteGrupo WHERE nControl = ?', [id]);

    // 4. Eliminar de EstudianteCalificaciones
    await connection.query('DELETE FROM EstudianteCalificaciones WHERE nControl = ?', [id]);

    // 5. Eliminar calificaciones
    await connection.query('DELETE FROM Calificaciones WHERE nControl = ?', [id]);

    // 6. Eliminar asistencias
    await connection.query('DELETE FROM Asistencia WHERE nControl = ?', [id]);

    // 7. Eliminar estudiante
    await connection.query('DELETE FROM Estudiante WHERE nControl = ?', [id]);

    // 8. Eliminar datos personales
    await connection.query('DELETE FROM DatosPersonales WHERE id_dp = ?', [id_dp]);

    await connection.commit();

    res.json({
      success: true,
      message: 'Alumno eliminado exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar alumno:', error);
    res.status(500).json({ message: 'Error al eliminar alumno', error: error.message });
  } finally {
    connection.release();
  }
};

// Cambiar estado del alumno
exports.toggleEstadoAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      `UPDATE Estudiante 
       SET estado = IF(estado = 'activo', 'inactivo', 'activo')
       WHERE nControl = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ message: 'Error al cambiar estado', error: error.message });
  }
};
