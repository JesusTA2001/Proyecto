const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function hashearPasswords() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'proyectoingles'
  });

  try {
    console.log('🔐 Obteniendo usuarios...');
    const [usuarios] = await connection.query('SELECT id_usuario, usuario, contraseña FROM Usuarios');
    
    console.log(`📊 Total de usuarios: ${usuarios.length}`);
    console.log('🔄 Hasheando contraseñas...\n');

    for (const user of usuarios) {
      const passwordActual = user.contraseña;
      
      // Verificar si ya está hasheada (empieza con $2b$)
      if (passwordActual.startsWith('$2b$')) {
        console.log(`✓ ${user.usuario} - Ya tiene contraseña hasheada`);
        continue;
      }

      // Hashear la contraseña actual
      const hashedPassword = await bcrypt.hash(passwordActual, 10);
      
      // Actualizar en la base de datos
      await connection.query(
        'UPDATE Usuarios SET contraseña = ? WHERE id_usuario = ?',
        [hashedPassword, user.id_usuario]
      );
      
      console.log(`✅ ${user.usuario} - Contraseña hasheada (original: ${passwordActual})`);
    }

    console.log('\n✅ ¡Proceso completado exitosamente!');
    console.log('\n📝 IMPORTANTE: Guarda estas credenciales para hacer login:');
    console.log('═'.repeat(60));
    
    // Mostrar algunos ejemplos
    const [usuariosActualizados] = await connection.query('SELECT usuario, rol FROM Usuarios WHERE rol IN ("PROFESOR", "ADMINISTRADOR", "ESTUDIANTE") LIMIT 10');
    
    console.log('\nEjemplos de usuarios para login:');
    console.log('─'.repeat(60));
    for (const u of usuariosActualizados) {
      // Obtener la contraseña original del log anterior
      const original = usuarios.find(us => us.usuario === u.usuario);
      console.log(`Usuario: ${u.usuario.padEnd(10)} | Contraseña: ${original?.contraseña.padEnd(15)} | Rol: ${u.rol}`);
    }
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

hashearPasswords();
