const { pool } = require('../config/db');

async function run() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM Usuarios WHERE usuario = ?', ['coord1']);
    if (rows.length === 0) {
      console.log('Usuario coord1 no encontrado');
    } else {
      const u = rows[0];
      console.log('Encontrado coord1:');
      console.log('id_usuario:', u.id_usuario);
      console.log('usuario:', u.usuario);
      console.log('contraseña:', u.contraseña);
      console.log('rol:', u.rol);
      console.log('id_relacion:', u.id_relacion);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    connection.release();
    process.exit(0);
  }
}

run();
