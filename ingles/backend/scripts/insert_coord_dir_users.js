const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

async function insertarUsuarios() {
  const connection = await pool.getConnection();
  try {
    const password = '123456';
    const passwordHash = await bcrypt.hash(password, 10);

    const usuarios = [];
    for (let i = 1; i <= 9; i++) usuarios.push({ usuario: `coord${i}`, rol: 'COORDINADOR' });
    for (let i = 1; i <= 3; i++) usuarios.push({ usuario: `dir${i}`, rol: 'DIRECTIVO' });

    console.log('Insertando/actualizando usuarios (contraseña: 123456)');

    for (const u of usuarios) {
      await connection.query(
        `INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE contraseña = VALUES(contraseña), rol = VALUES(rol), id_relacion = VALUES(id_relacion)`,
        [u.usuario, passwordHash, u.rol, 0]
      );
      console.log(`✓ ${u.usuario} -> ${u.rol}`);
    }

    console.log('\nTodos los usuarios procesados.');
  } catch (error) {
    console.error('Error al insertar usuarios:', error.message);
  } finally {
    connection.release();
    process.exit(0);
  }
}

insertarUsuarios();
