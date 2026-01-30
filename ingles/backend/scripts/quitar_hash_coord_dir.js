const { pool } = require('../config/db');

async function quitarHashCoordinadoresDirectivos() {
  let connection;
  
  try {
    console.log('🔓 QUITANDO HASHEO DE CONTRASEÑAS - COORDINADORES Y DIRECTIVOS\n');
    console.log('='.repeat(80));

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Ver contraseñas actuales
    console.log('\n📋 CONTRASEÑAS ACTUALES (COORDINADORES):');
    const [coordAntes] = await connection.query(`
      SELECT usuario, contraseña 
      FROM usuarios 
      WHERE rol = 'COORDINADOR' 
      ORDER BY usuario
    `);
    console.table(coordAntes.map(u => ({ 
      usuario: u.usuario, 
      contraseña_actual: u.contraseña.substring(0, 30) + '...' 
    })));

    console.log('\n📋 CONTRASEÑAS ACTUALES (DIRECTIVOS):');
    const [dirAntes] = await connection.query(`
      SELECT usuario, contraseña 
      FROM usuarios 
      WHERE rol = 'DIRECTIVO' 
      ORDER BY usuario
    `);
    console.table(dirAntes.map(u => ({ 
      usuario: u.usuario, 
      contraseña_actual: u.contraseña.substring(0, 30) + '...' 
    })));

    // 2. Actualizar coordinadores
    console.log('\n🔄 ACTUALIZANDO CONTRASEÑAS DE COORDINADORES...');
    const [resultCoord] = await connection.query(`
      UPDATE usuarios 
      SET contraseña = '123456' 
      WHERE rol = 'COORDINADOR'
    `);
    console.log(`✅ ${resultCoord.affectedRows} coordinadores actualizados`);

    // 3. Actualizar directivos
    console.log('\n🔄 ACTUALIZANDO CONTRASEÑAS DE DIRECTIVOS...');
    const [resultDir] = await connection.query(`
      UPDATE usuarios 
      SET contraseña = '123456' 
      WHERE rol = 'DIRECTIVO'
    `);
    console.log(`✅ ${resultDir.affectedRows} directivos actualizados`);

    // 4. Verificar cambios
    console.log('\n' + '='.repeat(80));
    console.log('✅ VERIFICACIÓN FINAL:\n');

    console.log('👥 COORDINADORES - NUEVAS CONTRASEÑAS:');
    const [coordDespues] = await connection.query(`
      SELECT usuario, contraseña 
      FROM usuarios 
      WHERE rol = 'COORDINADOR' 
      ORDER BY usuario
    `);
    console.table(coordDespues);

    console.log('\n👔 DIRECTIVOS - NUEVAS CONTRASEÑAS:');
    const [dirDespues] = await connection.query(`
      SELECT usuario, contraseña 
      FROM usuarios 
      WHERE rol = 'DIRECTIVO' 
      ORDER BY usuario
    `);
    console.table(dirDespues);

    // Confirmar transacción
    await connection.commit();

    console.log('\n' + '='.repeat(80));
    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE\n');
    console.log('📌 RESUMEN:');
    console.log(`   - ${resultCoord.affectedRows} coordinadores actualizados`);
    console.log(`   - ${resultDir.affectedRows} directivos actualizados`);
    console.log('   - Nueva contraseña para todos: 123456 (sin hashear)');
    console.log('\n💡 CREDENCIALES DE ACCESO:');
    console.log('   Coordinadores: coord1 / 123456, coord2 / 123456, ...');
    console.log('   Directivos: dir1 / 123456, dir2 / 123456, dir3 / 123456');

  } catch (error) {
    if (connection) {
      await connection.rollback();
      console.error('\n❌ Error en el proceso. Cambios revertidos.');
    }
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

quitarHashCoordinadoresDirectivos();
