const { pool } = require('./config/db');
const bcrypt = require('bcrypt');

async function verificarAaron() {
  try {
    console.log('🔍 Verificando usuario Aaron Rocha Rocha (2191930)...\n');

    // Buscar en tabla Usuarios
    const [usuarios] = await pool.query(`
      SELECT * FROM Usuarios WHERE id_relacion = ?
    `, ['2191930']);

    if (usuarios.length === 0) {
      console.log('❌ No se encontró el usuario con id_relacion 2191930 en la tabla Usuarios');
      console.log('\n💡 Verifica si existe en la tabla Estudiante:');
      
      const [estudiante] = await pool.query(`
        SELECT e.nControl, e.estado, e.ubicacion, 
               dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno, dp.email
        FROM Estudiante e
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE e.nControl = ?
      `, ['2191930']);
      
      if (estudiante.length > 0) {
        const est = estudiante[0];
        console.log('\n✅ El estudiante SÍ existe en la tabla Estudiante:');
        console.log('Nombre:', `${est.apellidoPaterno} ${est.apellidoMaterno} ${est.nombre}`);
        console.log('Email:', est.email);
        console.log('\n❌ PERO NO tiene usuario en la tabla Usuarios');
        console.log('💡 Solución: Crear usuario ejecutando:');
        console.log('   INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion, estado)');
        console.log(`   VALUES ('2191930', '123456', 'ESTUDIANTE', '2191930', 'ACTIVO');`);
      } else {
        console.log('❌ El estudiante tampoco existe en la tabla Estudiante');
      }
      process.exit(1);
    }

    const user = usuarios[0];
    console.log('=== DATOS DEL USUARIO ===');
    console.log('ID Usuario:', user.id_usuario);
    console.log('Usuario (login):', user.usuario);
    console.log('Rol:', user.rol);
    console.log('ID Relación (nControl):', user.id_relacion);
    console.log('Estado Usuario:', user.estado);
    
    const passwordHash = user['contraseña'] || user.contraseña;
    console.log('Contraseña existe:', passwordHash ? 'SÍ' : 'NO');
    
    if (passwordHash) {
      console.log('Tipo contraseña:', passwordHash.startsWith('$2') ? 'Hash bcrypt' : 'Texto plano');
      console.log('Hash completo:', passwordHash.substring(0, 30) + '...');
    }
    
    // Buscar datos personales
    const [estudiante] = await pool.query(`
      SELECT e.nControl, e.estado, e.ubicacion, 
             dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno, dp.email
      FROM Estudiante e
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE e.nControl = ?
    `, [user.id_relacion]);
    
    if (estudiante.length > 0) {
      const est = estudiante[0];
      console.log('\n=== DATOS PERSONALES ===');
      console.log('Número Control:', est.nControl);
      console.log('Nombre Completo:', `${est.apellidoPaterno} ${est.apellidoMaterno} ${est.nombre}`);
      console.log('Email:', est.email);
      console.log('Estado:', est.estado);
    }
    
    console.log('\n');

    // Verificar contraseña
    if (!passwordHash) {
      console.log('❌ ERROR: El usuario NO tiene contraseña en la base de datos');
      console.log('💡 Solución: Actualizar la contraseña del usuario');
      process.exit(1);
    }

    // Probar contraseñas comunes
    const passwordsToTest = ['123456', '2191930', 'aaron', 'Aaron123'];
    
    console.log('🔐 Probando contraseñas comunes...\n');
    for (const pwd of passwordsToTest) {
      try {
        let isMatch = false;
        if (passwordHash.startsWith('$2')) {
          // bcrypt hash
          isMatch = await bcrypt.compare(pwd, passwordHash);
        } else {
          // texto plano
          isMatch = pwd === passwordHash;
        }
        
        if (isMatch) {
          console.log(`✅ CONTRASEÑA ENCONTRADA: "${pwd}"`);
          console.log(`\n📋 Credenciales de login:`);
          console.log(`   Usuario: ${user.usuario}`);
          console.log(`   Contraseña: ${pwd}`);
          process.exit(0);
        } else {
          console.log(`❌ "${pwd}" - No coincide`);
        }
      } catch (err) {
        console.log(`⚠️  "${pwd}" - Error al comparar:`, err.message);
      }
    }

    console.log('\n❌ No se encontró la contraseña entre las comunes');
    console.log('\n💡 Solución: Actualizar contraseña ejecutando:');
    console.log(`   node backend/scripts/actualizar_password.js 2191930 123456`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

verificarAaron();
