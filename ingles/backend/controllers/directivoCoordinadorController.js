const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const roleConfig = {
  DIRECTIVO: {
    table: 'Directivo',
    idField: 'id_Directivo'
  },
  COORDINADOR: {
    table: 'Coordinador',
    idField: 'id_Coordinador'
  }
};

function getRoleConfig(tipoRol = '') {
  return roleConfig[String(tipoRol).toUpperCase()] || null;
}

exports.getDirectivosCoordinadores = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        'DIRECTIVO' AS tipoRol,
        d.id_Directivo AS id_rol,
        e.id_empleado,
        e.estado,
        e.RFC,
        dp.apellidoPaterno,
        dp.apellidoMaterno,
        dp.nombre,
        dp.email,
        dp.genero,
        dp.CURP,
        dp.telefono,
        dp.direccion
      FROM Directivo d
      JOIN Empleado e ON d.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp

      UNION ALL

      SELECT
        'COORDINADOR' AS tipoRol,
        c.id_Coordinador AS id_rol,
        e.id_empleado,
        e.estado,
        e.RFC,
        dp.apellidoPaterno,
        dp.apellidoMaterno,
        dp.nombre,
        dp.email,
        dp.genero,
        dp.CURP,
        dp.telefono,
        dp.direccion
      FROM Coordinador c
      JOIN Empleado e ON c.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp

      ORDER BY apellidoPaterno, apellidoMaterno, nombre
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener directivos y coordinadores:', error);
    res.status(500).json({ message: 'Error al obtener directivos y coordinadores', error: error.message });
  }
};

exports.createDirectivoCoordinador = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      tipoRol,
      apellidoPaterno,
      apellidoMaterno,
      nombre,
      email,
      genero,
      CURP,
      RFC,
      telefono,
      direccion
    } = req.body;

    const cfg = getRoleConfig(tipoRol);
    if (!cfg) {
      throw new Error('tipoRol inválido. Debe ser DIRECTIVO o COORDINADOR');
    }

    if (!CURP || CURP.length < 10) {
      throw new Error('La CURP debe tener al menos 10 caracteres para generar el usuario');
    }

    const usuarioGenerado = CURP.substring(0, 10).toUpperCase();

    const [dpResult] = await connection.query(
      `INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion]
    );

    const id_dp = dpResult.insertId;

    const [empleadoResult] = await connection.query(
      `INSERT INTO Empleado (id_dp, estado, RFC)
       VALUES (?, 'activo', ?)`,
      [id_dp, RFC]
    );

    const id_empleado = empleadoResult.insertId;

    const [rolResult] = await connection.query(
      `INSERT INTO ${cfg.table} (id_empleado, estado)
       VALUES (?, 'activo')`,
      [id_empleado]
    );

    const id_rol = rolResult.insertId;

    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const [existeUsuario] = await connection.query(
      `SELECT id_usuario, rol FROM Usuarios WHERE usuario = ?`,
      [usuarioGenerado]
    );

    if (existeUsuario.length > 0) {
      if (existeUsuario[0].rol === String(tipoRol).toUpperCase()) {
        await connection.query(
          `UPDATE Usuarios SET id_relacion = ? WHERE usuario = ?`,
          [id_rol, usuarioGenerado]
        );
      } else {
        throw new Error(`El usuario ${usuarioGenerado} ya existe con rol ${existeUsuario[0].rol}`);
      }
    } else {
      await connection.query(
        `INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion)
         VALUES (?, ?, ?, ?)`,
        [usuarioGenerado, hashedPassword, String(tipoRol).toUpperCase(), id_rol]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: `${String(tipoRol).toUpperCase()} creado exitosamente`,
      id_rol,
      id_empleado,
      id_dp,
      usuarioGenerado,
      passwordTemporal: defaultPassword
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear directivo/coordinador:', error);
    res.status(500).json({ message: 'Error al crear directivo/coordinador', error: error.message });
  } finally {
    connection.release();
  }
};

exports.updateDirectivoCoordinador = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const {
      tipoRol,
      apellidoPaterno,
      apellidoMaterno,
      nombre,
      email,
      genero,
      CURP,
      RFC,
      telefono,
      direccion,
      estado
    } = req.body;

    const cfg = getRoleConfig(tipoRol);
    if (!cfg) {
      throw new Error('tipoRol inválido. Debe ser DIRECTIVO o COORDINADOR');
    }

    const [rows] = await connection.query(
      `SELECT r.id_empleado, e.id_dp
       FROM ${cfg.table} r
       JOIN Empleado e ON r.id_empleado = e.id_empleado
       WHERE r.${cfg.idField} = ?`,
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    const { id_empleado, id_dp } = rows[0];

    await connection.query(
      `UPDATE DatosPersonales
       SET apellidoPaterno = ?, apellidoMaterno = ?, nombre = ?,
           email = ?, genero = ?, CURP = ?, telefono = ?, direccion = ?
       WHERE id_dp = ?`,
      [apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion, id_dp]
    );

    await connection.query(
      `UPDATE Empleado
       SET estado = ?, RFC = ?
       WHERE id_empleado = ?`,
      [estado, RFC, id_empleado]
    );

    await connection.query(
      `UPDATE ${cfg.table}
       SET estado = ?
       WHERE ${cfg.idField} = ?`,
      [estado, id]
    );

    if (CURP && CURP.length >= 10) {
      const nuevoUsuario = CURP.substring(0, 10).toUpperCase();
      await connection.query(
        `UPDATE Usuarios
         SET usuario = ?
         WHERE rol = ? AND id_relacion = ?`,
        [nuevoUsuario, String(tipoRol).toUpperCase(), id]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: `${String(tipoRol).toUpperCase()} actualizado exitosamente`
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar directivo/coordinador:', error);
    res.status(500).json({ message: 'Error al actualizar directivo/coordinador', error: error.message });
  } finally {
    connection.release();
  }
};

exports.toggleEstadoDirectivoCoordinador = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { tipoRol } = req.body;

    const cfg = getRoleConfig(tipoRol);
    if (!cfg) {
      return res.status(400).json({ message: 'tipoRol inválido. Debe ser DIRECTIVO o COORDINADOR' });
    }

    const [rows] = await connection.query(
      `SELECT r.id_empleado
       FROM ${cfg.table} r
       WHERE r.${cfg.idField} = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    const { id_empleado } = rows[0];

    await connection.query(
      `UPDATE Empleado
       SET estado = IF(estado = 'activo', 'inactivo', 'activo')
       WHERE id_empleado = ?`,
      [id_empleado]
    );

    await connection.query(
      `UPDATE ${cfg.table}
       SET estado = IF(estado = 'activo', 'inactivo', 'activo')
       WHERE ${cfg.idField} = ?`,
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
