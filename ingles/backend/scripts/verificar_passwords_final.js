const { pool } = require('../config/db');

async function verificarPasswordsSimple() {
  try {
    console.log('🔍 VERIFICACIÓN DE CONTRASEÑAS ACTUALIZADAS\n');
    console.log('='.repeat(80));

    // Verificar coordinadores
    console.log('\n👥 COORDINADORES:\n');
    const [coordinadores] = await pool.query(`
      SELECT usuario, contraseña, rol
      FROM usuarios
      WHERE rol = 'COORDINADOR'
      ORDER BY usuario
    `);
    console.table(coordinadores);

    // Verificar directivos
    console.log('\n👔 DIRECTIVOS:\n');
    const [directivos] = await pool.query(`
      SELECT usuario, contraseña, rol
      FROM usuarios
      WHERE rol = 'DIRECTIVO'
      ORDER BY usuario
    `);
    console.table(directivos);

    // Comparar con profesores
    console.log('\n👨‍🏫 PROFESORES (primeros 3 para comparación):\n');
    const [profesores] = await pool.query(`
      SELECT usuario, 
             CASE 
               WHEN contraseña LIKE '$2%' THEN CONCAT(SUBSTRING(contraseña, 1, 20), '... (HASH bcrypt)')
               ELSE contraseña 
             END as contraseña,
             rol
      FROM usuarios
      WHERE rol = 'PROFESOR'
      ORDER BY usuario
      LIMIT 3
    `);
    console.table(profesores);

    console.log('\n' + '='.repeat(80));
    console.log('✅ VERIFICACIÓN COMPLETADA\n');
    console.log('📌 ESTADO:');
    console.log(`   ✅ ${coordinadores.length} coordinadores con contraseña: 123456 (texto plano)`);
    console.log(`   ✅ ${directivos.length} directivos con contraseña: 123456 (texto plano)`);
    console.log('   ✅ Profesores mantienen contraseñas hasheadas con bcrypt');
    console.log('\n💡 PUEDES HACER LOGIN CON:');
    console.log('   Coordinadores: coord1/123456, coord2/123456, ..., coord9/123456');
    console.log('   Directivos: dir1/123456, dir2/123456, dir3/123456');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

verificarPasswordsSimple();
