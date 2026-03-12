const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

// Obtener todos los administradores
exports.getAdministradores = async (req, res) => {
  try {
    const [administradores] = await pool.query(`
      SELECT a.id_Administrador, e.estado,
             e.id_empleado, e.RFC,
             dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre,
             dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
      FROM Administrador a
      JOIN Empleado e ON a.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre
    `);
    
    res.json(administradores);
  } catch (error) {
    console.error('Error al obtener administradores:', error);
    res.status(500).json({ message: 'Error al obtener administradores', error: error.message });
  }
};

// Obtener un administrador por ID
exports.getAdministradorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [administradores] = await pool.query(`
      SELECT a.id_administrador, a.gradoEstudio,
             e.id_empleado, e.estado,
             dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre,
             dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
      FROM Administrador a
      JOIN Empleado e ON a.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE a.id_administrador = ?
    `, [id]);

    if (administradores.length === 0) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json(administradores[0]);
  } catch (error) {
    console.error('Error al obtener administrador:', error);
    res.status(500).json({ message: 'Error al obtener administrador', error: error.message });
  }
};

// Crear administrador
exports.createAdministrador = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    console.log('📥 Datos recibidos para crear administrador:', req.body);
    await connection.beginTransaction();

    const {
      apellidoPaterno,
      apellidoMaterno,
      nombre,
      email,
      genero,
      CURP,
      RFC,
      telefono,
      direccion,
      ubicacion,
      gradoEstudio,
      usuario,
      contraseña
    } = req.body;

    console.log('✅ Datos extraídos:', {
      apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, RFC,
      telefono, direccion, ubicacion, gradoEstudio
    });

    // 1. Insertar datos personales
    console.log('📝 Insertando datos personales...');
    const [dpResult] = await connection.query(
      `INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion]
    );

    const id_dp = dpResult.insertId;
    console.log('✅ DatosPersonales creado con id_dp:', id_dp);

    // 2. Insertar empleado
    console.log('📝 Insertando empleado con RFC:', RFC);
    const [empleadoResult] = await connection.query(
      `INSERT INTO Empleado (id_dp, estado, RFC)
       VALUES (?, 'activo', ?)`,
      [id_dp, RFC]
    );

    const id_empleado = empleadoResult.insertId;
    console.log('✅ Empleado creado con id_empleado:', id_empleado);

    // 3. Insertar administrador (sin gradoEstudio - la columna no existe en la BD)
    console.log('📝 Insertando administrador...');
    const [adminResult] = await connection.query(
      `INSERT INTO Administrador (id_empleado)
       VALUES (?)`,
      [id_empleado]
    );

    const id_administrador = adminResult.insertId;
    console.log('✅ Administrador creado con id_administrador:', id_administrador);

    // 4. Crear usuario automáticamente con credenciales por defecto
    // Usuario: Primeros 10 dígitos de CURP (RFC sin homoclave), Contraseña: 123456
    if (!CURP || CURP.length < 10) {
      throw new Error('La CURP debe tener al menos 10 caracteres para generar el usuario');
    }
    const usuarioAdmin = CURP.substring(0, 10).toUpperCase();
    console.log('📝 Creando usuario con primeros 10 dígitos de CURP:', usuarioAdmin);
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await connection.query(
      `INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion)
       VALUES (?, ?, 'ADMINISTRADOR', ?)`,
      [usuarioAdmin, hashedPassword, id_administrador]
    );
    console.log('✅ Usuario creado exitosamente');

    await connection.commit();
    console.log('🎉 Transacción completada exitosamente');

    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      id_administrador,
      id_empleado,
      id_dp
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error al crear administrador:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ message: 'Error al crear administrador', error: error.message });
  } finally {
    connection.release();
  }
};

// Actualizar administrador
exports.updateAdministrador = async (req, res) => {
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
      RFC,
      telefono,
      direccion,
      ubicacion,
      gradoEstudio,
      estado
    } = req.body;

    // 1. Obtener id_empleado e id_dp del administrador
    const [admin] = await connection.query(`
      SELECT a.id_empleado, e.id_dp
      FROM Administrador a
      JOIN Empleado e ON a.id_empleado = e.id_empleado
      WHERE a.id_administrador = ?
    `, [id]);

    if (admin.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    const { id_empleado, id_dp } = admin[0];

    // 2. Actualizar datos personales
    await connection.query(
      `UPDATE DatosPersonales 
       SET apellidoPaterno = ?, apellidoMaterno = ?, nombre = ?, 
           email = ?, genero = ?, CURP = ?, telefono = ?, direccion = ?
       WHERE id_dp = ?`,
      [apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion, id_dp]
    );

    // 3. Actualizar empleado
    await connection.query(
      `UPDATE Empleado 
       SET estado = ?, RFC = ?
       WHERE id_empleado = ?`,
      [estado, RFC, id_empleado]
    );

    // 4. Actualizar administrador (solo estado)
    await connection.query(
      `UPDATE Administrador 
       SET estado = ?
       WHERE id_administrador = ?`,
      [estado, id]
    );

    // 5. Actualizar usuario si se modificó la CURP
    if (CURP && CURP.length >= 10) {
      const nuevoUsuario = CURP.substring(0, 10).toUpperCase();
      console.log('🔄 Intentando actualizar usuario administrador...');
      console.log('   Nuevo usuario:', nuevoUsuario);
      console.log('   id_administrador (id_relacion):', id);
      console.log('   CURP completa:', CURP);
      
      const [updateResult] = await connection.query(
        `UPDATE Usuarios 
         SET usuario = ?
         WHERE rol = 'ADMINISTRADOR' AND id_relacion = ?`,
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
      message: 'Administrador actualizado exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar administrador:', error);
    res.status(500).json({ message: 'Error al actualizar administrador', error: error.message });
  } finally {
    connection.release();
  }
};

// Eliminar administrador
exports.deleteAdministrador = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // 1. Obtener id_empleado e id_dp del administrador
    const [admin] = await connection.query(`
      SELECT a.id_empleado, e.id_dp
      FROM Administrador a
      JOIN Empleado e ON a.id_empleado = e.id_empleado
      WHERE a.id_administrador = ?
    `, [id]);

    if (admin.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    const { id_empleado, id_dp } = admin[0];

    // 2. Eliminar usuario asociado
    await connection.query(
      'DELETE FROM Usuarios WHERE rol = "ADMINISTRADOR" AND id_relacion = ?',
      [id]
    );

    // 3. Eliminar administrador
    await connection.query('DELETE FROM Administrador WHERE id_administrador = ?', [id]);

    // 4. Eliminar empleado
    await connection.query('DELETE FROM Empleado WHERE id_empleado = ?', [id_empleado]);

    // 5. Eliminar datos personales
    await connection.query('DELETE FROM DatosPersonales WHERE id_dp = ?', [id_dp]);

    await connection.commit();

    res.json({
      success: true,
      message: 'Administrador eliminado exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar administrador:', error);
    res.status(500).json({ message: 'Error al eliminar administrador', error: error.message });
  } finally {
    connection.release();
  }
};

// Cambiar estado del administrador
exports.toggleEstadoAdministrador = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;
    
    // Obtener id_empleado
    const [admin] = await connection.query(
      'SELECT id_empleado FROM Administrador WHERE id_administrador = ?',
      [id]
    );

    if (admin.length === 0) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    await connection.query(
      `UPDATE Empleado 
       SET estado = IF(estado = 'activo', 'inactivo', 'activo')
       WHERE id_empleado = ?`,
      [admin[0].id_empleado]
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
