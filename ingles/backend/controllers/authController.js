const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login
exports.login = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    // Buscar usuario
    const [usuarios] = await pool.query(
      'SELECT * FROM Usuarios WHERE usuario = ?',
      [usuario]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const user = usuarios[0];

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Obtener datos según el rol
    let userData = {};
    
    if (user.rol === 'ESTUDIANTE') {
      const [estudiante] = await pool.query(`
        SELECT e.nControl, e.estado, e.ubicacion, 
               dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre, 
               dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
        FROM Estudiante e
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE e.nControl = ?
      `, [user.id_relacion]);
      userData = estudiante[0];
    } 
    else if (user.rol === 'PROFESOR') {
      const [profesor] = await pool.query(`
        SELECT p.id_Profesor, p.ubicacion, p.estado, p.nivelEstudio,
               p.id_Profesor as numero_empleado, e.RFC,
               dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre, 
               dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
        FROM Profesor p
        JOIN Empleado e ON p.id_empleado = e.id_empleado
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE p.id_Profesor = ?
      `, [user.id_relacion]);
      userData = profesor[0];
    }
    else if (user.rol === 'ADMINISTRADOR') {
      const [admin] = await pool.query(`
        SELECT a.id_Administrador, a.estado,
               e.id_empleado as numero_empleado, e.RFC,
               dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre, 
               dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
        FROM Administrador a
        JOIN Empleado e ON a.id_empleado = e.id_empleado
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE a.id_Administrador = ?
      `, [user.id_relacion]);
      userData = admin[0];
    }
    else if (user.rol === 'COORDINADOR') {
      const [coord] = await pool.query(`
        SELECT c.id_Coordinador, c.estado,
               e.id_empleado as numero_empleado, e.RFC,
               dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre, 
               dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
        FROM Coordinador c
        JOIN Empleado e ON c.id_empleado = e.id_empleado
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE c.id_Coordinador = ?
      `, [user.id_relacion]);
      userData = coord[0];
    }
    else if (user.rol === 'DIRECTIVO') {
      const [dir] = await pool.query(`
        SELECT d.id_Directivo, d.estado,
               e.id_empleado as numero_empleado, e.RFC,
               dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre, 
               dp.email, dp.genero, dp.CURP, dp.telefono, dp.direccion
        FROM Directivo d
        JOIN Empleado e ON d.id_empleado = e.id_empleado
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE d.id_Directivo = ?
      `, [user.id_relacion]);
      userData = dir[0];
    }

    // Crear token JWT
    const token = jwt.sign(
      { 
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        rol: user.rol,
        id_relacion: user.id_relacion
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        usuario: user.usuario,
        rol: user.rol,
        ...userData
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Verificar token (para mantener sesión)
exports.verifyToken = async (req, res) => {
  try {
    const user = req.user;
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar token' });
  }
};
