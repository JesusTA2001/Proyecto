const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configuración de la base de datos
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'proyectoingles'
};

// Contraseñas simples para prueba
const usuariosPrueba = [
  { usuario: 'user1', password: 'password1', rol: 'ESTUDIANTE' },
  { usuario: 'user2', password: 'password2', rol: 'PROFESOR' },
  { usuario: 'user3', password: 'password3', rol: 'COORDINADOR' },
  { usuario: 'user4', password: 'password4', rol: 'DIRECTIVO' },
  { usuario: 'user5', password: 'password5', rol: 'ADMINISTRADOR' },
  { usuario: 'user6', password: 'password6', rol: 'ESTUDIANTE' },
  { usuario: 'user7', password: 'password7', rol: 'PROFESOR' },
  { usuario: 'user8', password: 'password8', rol: 'COORDINADOR' },
  { usuario: 'user9', password: 'password9', rol: 'DIRECTIVO' },
  { usuario: 'user10', password: 'password10', rol: 'ADMINISTRADOR' }
];

async function resetearPasswords() {
  let connection;
  
  try {
    console.log('📡 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a la base de datos\n');

    console.log('🔐 Reseteando contraseñas de usuarios de prueba...\n');
    
    for (const usr of usuariosPrueba) {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(usr.password, 10);
      
      // Actualizar en la base de datos
      const [result] = await connection.query(
        'UPDATE Usuarios SET contraseña = ? WHERE usuario = ?',
        [hashedPassword, usr.usuario]
      );
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${usr.usuario.padEnd(8)} - Contraseña: ${usr.password.padEnd(12)} (${usr.rol})`);
      } else {
        console.log(`⚠️  ${usr.usuario} - Usuario no encontrado en la base de datos`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Proceso completado');
    console.log('='.repeat(70));
    console.log('\n📋 CREDENCIALES DE PRUEBA:\n');
    console.log('┌─────────────┬──────────────┬──────────────────┐');
    console.log('│   Usuario   │  Contraseña  │       Rol        │');
    console.log('├─────────────┼──────────────┼──────────────────┤');
    usuariosPrueba.forEach(usr => {
      console.log(`│ ${usr.usuario.padEnd(11)} │ ${usr.password.padEnd(12)} │ ${usr.rol.padEnd(16)} │`);
    });
    console.log('└─────────────┴──────────────┴──────────────────┘');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n📡 Conexión cerrada');
    }
  }
}

// Ejecutar
resetearPasswords()
  .then(() => {
    console.log('\n✅ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
