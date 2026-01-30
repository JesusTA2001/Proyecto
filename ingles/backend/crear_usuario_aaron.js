const { pool } = require('./config/db');
const bcrypt = require('bcrypt');

async function crearUsuarioAaron() {
  try {
    console.log('🔨 Creando usuario para Aaron Rocha Rocha (2191930)...\n');

    // Verificar que el estudiante existe
    const [estudiante] = await pool.query(`
      SELECT e.nControl, dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno 
      FROM Estudiante e
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE e.nControl = ?
    `, ['2191930']);

    if (estudiante.length === 0) {
      console.log('❌ No se encontró el estudiante con nControl 2191930');
      process.exit(1);
    }

    console.log('✅ Estudiante encontrado:', `${estudiante[0].apellidoPaterno} ${estudiante[0].apellidoMaterno} ${estudiante[0].nombre}`);
    
    // Verificar si ya existe usuario
    const [existente] = await pool.query(`
      SELECT * FROM Usuarios WHERE id_relacion = ?
    `, ['2191930']);

    if (existente.length > 0) {
      console.log('\n⚠️  Ya existe un usuario para este estudiante');
      console.log('Usuario:', existente[0].usuario);
      console.log('Estado:', existente[0].estado);
      console.log('\n¿Deseas actualizar la contraseña? Ejecuta:');
      console.log('node backend/actualizar_password_aaron.js');
      process.exit(0);
    }

    // Hash de la contraseña
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('\n🔐 Creando usuario...');
    console.log('Usuario:', '2191930');
    console.log('Contraseña:', password);
    console.log('Rol: ESTUDIANTE');

    // Crear usuario
    const [result] = await pool.query(`
      INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion)
      VALUES (?, ?, 'ESTUDIANTE', ?)
    `, ['2191930', hashedPassword, '2191930']);

    console.log('\n✅ Usuario creado exitosamente!');
    console.log('ID Usuario:', result.insertId);
    console.log('\n📋 Credenciales de login:');
    console.log('   Usuario: 2191930');
    console.log('   Contraseña: 123456');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

crearUsuarioAaron();
