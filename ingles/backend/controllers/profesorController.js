const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

// Obtener todos los profesores
exports.getProfesores = async (req, res) => {
  try {
    const [profesores] = await pool.query(`
      SELECT p.id_Profesor, p.ubicacion, p.estado, p.nivelEstudio,
             e.id_empleado, e.RFC,
             dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre,
             dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
      FROM Profesor p
      JOIN Empleado e ON p.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre
    `);
    
    res.json(profesores);
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ message: 'Error al obtener profesores', error: error.message });
  }
};

// Obtener un profesor por ID
exports.getProfesorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [profesores] = await pool.query(`
      SELECT p.id_Profesor, p.ubicacion, p.estado, p.nivelEstudio,
             e.id_empleado, e.RFC,
             dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre,
             dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
      FROM Profesor p
      JOIN Empleado e ON p.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE p.id_Profesor = ?
    `, [id]);

    if (profesores.length === 0) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    res.json(profesores[0]);
  } catch (error) {
    console.error('Error al obtener profesor:', error);
    res.status(500).json({ message: 'Error al obtener profesor', error: error.message });
  }
};

// Crear profesor
exports.createProfesor = async (req, res) => {
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
      RFC,
      nivelEstudio,
      usuario,
      contraseña,
      estudios // Array de estudios académicos
    } = req.body;

    // 1. Insertar datos personales
    const [dpResult] = await connection.query(
      `INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion]
    );

    const id_dp = dpResult.insertId;

    // 2. Insertar empleado
    const [empleadoResult] = await connection.query(
      `INSERT INTO Empleado (id_dp, estado, RFC) VALUES (?, 'activo', ?)`,
      [id_dp, RFC]
    );

    const id_empleado = empleadoResult.insertId;

    // 3. Insertar profesor (nivelEstudio ya no se usa, pero lo dejamos por compatibilidad)
    const [profesorResult] = await connection.query(
      `INSERT INTO Profesor (id_empleado, ubicacion, estado, nivelEstudio)
       VALUES (?, ?, 'activo', ?)`,
      [id_empleado, ubicacion, nivelEstudio || null]
    );

    const id_profesor = profesorResult.insertId;

    // 4. Insertar estudios académicos si se proporcionaron
    if (estudios && Array.isArray(estudios) && estudios.length > 0) {
      for (const estudio of estudios) {
        await connection.query(
          `INSERT INTO Preparacion (id_Profesor, id_Estudio, titulo, institucion, año_obtencion)
           VALUES (?, ?, ?, ?, ?)`,
          [
            id_profesor,
            estudio.id_Estudio,
            estudio.titulo,
            estudio.institucion || null,
            estudio.año_obtencion || null
          ]
        );
      }
    }

    // 5. Crear usuario automáticamente con credenciales por defecto
    // Usuario: Primeros 10 dígitos de CURP (RFC sin homoclave), Contraseña: 123456
    if (!CURP || CURP.length < 10) {
      throw new Error('La CURP debe tener al menos 10 caracteres para generar el usuario');
    }
    const usuarioProfesor = CURP.substring(0, 10).toUpperCase();
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    // Verificar si el usuario ya existe
    const [existeUsuario] = await connection.query(
      `SELECT id_usuario, rol FROM Usuarios WHERE usuario = ?`,
      [usuarioProfesor]
    );

    if (existeUsuario.length > 0) {
      // Si el usuario existe y es PROFESOR, actualizar la relación
      if (existeUsuario[0].rol === 'PROFESOR') {
        await connection.query(
          `UPDATE Usuarios SET id_relacion = ? WHERE usuario = ?`,
          [id_profesor, usuarioProfesor]
        );
      } else {
        // Si el usuario existe pero con otro rol, error
        throw new Error(`El usuario ${usuarioProfesor} ya existe con rol ${existeUsuario[0].rol}. No se puede crear el profesor.`);
      }
    } else {
      // Si no existe, crear nuevo usuario
      await connection.query(
        `INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion)
         VALUES (?, ?, 'PROFESOR', ?)`,
        [usuarioProfesor, hashedPassword, id_profesor]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Profesor creado exitosamente',
      id_profesor,
      id_empleado,
      id_dp,
      estudios_creados: estudios ? estudios.length : 0
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear profesor:', error);
    res.status(500).json({ message: 'Error al crear profesor', error: error.message });
  } finally {
    connection.release();
  }
};

// Actualizar profesor
exports.updateProfesor = async (req, res) => {
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
      numero_empleado,
      RFC,
      nivelEstudio,
      estado
    } = req.body;

    // 1. Obtener id_empleado e id_dp del profesor
    const [profesor] = await connection.query(`
      SELECT p.id_empleado, e.id_dp
      FROM Profesor p
      JOIN Empleado e ON p.id_empleado = e.id_empleado
      WHERE p.id_profesor = ?
    `, [id]);

    if (profesor.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    const { id_empleado, id_dp } = profesor[0];

    // 2. Actualizar datos personales
    await connection.query(
      `UPDATE DatosPersonales 
       SET apellidoPaterno = ?, apellidoMaterno = ?, nombre = ?, 
           email = ?, genero = ?, CURP = ?, telefono = ?, direccion = ?
       WHERE id_dp = ?`,
      [apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion, id_dp]
    );

    // 3. Actualizar empleado (solo estado, RFC no cambia)
    await connection.query(
      `UPDATE Empleado 
       SET estado = ?
       WHERE id_empleado = ?`,
      [estado, id_empleado]
    );

    // 4. Actualizar profesor
    await connection.query(
      `UPDATE Profesor 
       SET ubicacion = ?, nivelEstudio = ?, estado = ?
       WHERE id_profesor = ?`,
      [ubicacion, nivelEstudio, estado, id]
    );

    // 5. Actualizar usuario si se modificó la CURP
    if (CURP && CURP.length >= 10) {
      const nuevoUsuario = CURP.substring(0, 10).toUpperCase();
      console.log('🔄 Intentando actualizar usuario profesor...');
      console.log('   Nuevo usuario:', nuevoUsuario);
      console.log('   id_profesor (id_relacion):', id);
      console.log('   CURP completa:', CURP);
      
      const [updateResult] = await connection.query(
        `UPDATE Usuarios 
         SET usuario = ?
         WHERE rol = 'PROFESOR' AND id_relacion = ?`,
        [nuevoUsuario, id]
      );
      
      console.log('✅ Filas afectadas:', updateResult.affectedRows);
      if (updateResult.affectedRows > 0) {
        console.log('✅ Usuario actualizado exitosamente a:', nuevoUsuario);
      } else {
        console.log('⚠️ No se encontró ningún usuario para actualizar');
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Profesor actualizado exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar profesor:', error);
    res.status(500).json({ message: 'Error al actualizar profesor', error: error.message });
  } finally {
    connection.release();
  }
};

// Eliminar profesor
exports.deleteProfesor = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // 1. Obtener id_empleado e id_dp del profesor
    const [profesor] = await connection.query(`
      SELECT p.id_empleado, e.id_dp
      FROM Profesor p
      JOIN Empleado e ON p.id_empleado = e.id_empleado
      WHERE p.id_profesor = ?
    `, [id]);

    if (profesor.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    const { id_empleado, id_dp } = profesor[0];

    // 2. Eliminar usuario asociado
    await connection.query(
      'DELETE FROM Usuarios WHERE rol = "PROFESOR" AND id_relacion = ?',
      [id]
    );

    // 3. Actualizar grupos (poner id_profesor a NULL)
    await connection.query(
      'UPDATE Grupo SET id_profesor = NULL WHERE id_profesor = ?',
      [id]
    );

    // 4. Eliminar profesor
    await connection.query('DELETE FROM Profesor WHERE id_profesor = ?', [id]);

    // 5. Eliminar empleado
    await connection.query('DELETE FROM Empleado WHERE id_empleado = ?', [id_empleado]);

    // 6. Eliminar datos personales
    await connection.query('DELETE FROM DatosPersonales WHERE id_dp = ?', [id_dp]);

    await connection.commit();

    res.json({
      success: true,
      message: 'Profesor eliminado exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar profesor:', error);
    res.status(500).json({ message: 'Error al eliminar profesor', error: error.message });
  } finally {
    connection.release();
  }
};

// Cambiar estado del profesor
exports.toggleEstadoProfesor = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;
    
    await connection.query(
      `UPDATE Profesor 
       SET estado = IF(estado = 'activo', 'inactivo', 'activo')
       WHERE id_Profesor = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ message: 'Error al cambiar estado', error: error.message });
  } finally {
    connection.release();
  }
};
