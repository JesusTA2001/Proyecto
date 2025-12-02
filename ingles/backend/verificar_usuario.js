const { pool } = require('./config/db');

async function verificarUsuario() {
  try {
    console.log('Buscando usuario 1000 en la base de datos...\n');
    
    const [usuarios] = await pool.query(
      'SELECT * FROM Usuarios WHERE usuario = ?',
      ['1000']
    );

    if (usuarios.length === 0) {
      console.log('❌ Usuario no encontrado en la tabla Usuarios');
      return;
    }

    const user = usuarios[0];
    console.log('✅ Usuario encontrado:');
    console.log('ID Usuario:', user.id_usuario);
    console.log('Usuario:', user.usuario);
    console.log('Contraseña:', user.contraseña);
    console.log('Rol:', user.rol);
    console.log('ID Relación:', user.id_relacion);
    
    // Buscar el estudiante
    console.log('\nBuscando estudiante con nControl:', user.id_relacion);
    const [estudiante] = await pool.query(
      'SELECT * FROM Estudiante WHERE nControl = ?',
      [user.id_relacion]
    );
    
    if (estudiante.length > 0) {
      console.log('\n✅ Estudiante encontrado:');
      console.log('nControl:', estudiante[0].nControl);
      console.log('Estado:', estudiante[0].estado);
      console.log('ID_dp:', estudiante[0].id_dp);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verificarUsuario();
