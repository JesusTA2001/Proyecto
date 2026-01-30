const { pool } = require('../config/db');

async function verificarDatosPersonales() {
  try {
    console.log('🔍 VERIFICANDO TABLA datospersonales\n');
    console.log('='.repeat(80));

    // 1. Ver estructura de datospersonales
    console.log('\n📋 ESTRUCTURA DE LA TABLA datospersonales:');
    const [dpStructure] = await pool.query('DESCRIBE datospersonales');
    console.table(dpStructure);

    // 2. Ver algunos datos personales
    console.log('\n👤 DATOS EN datospersonales (primeros 5):');
    const [dpData] = await pool.query('SELECT * FROM datospersonales LIMIT 5');
    console.table(dpData);

    // 3. Ver la relación completa para profesores
    console.log('\n🔗 RELACIÓN COMPLETA PARA PROFESORES:');
    console.log('   usuarios -> profesor -> empleado -> datospersonales');
    const [relacionProf] = await pool.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.rol,
        u.id_relacion,
        p.id_Profesor,
        p.id_empleado,
        p.ubicacion,
        p.estado as estado_profesor,
        e.id_empleado,
        e.id_dp,
        e.RFC,
        e.estado as estado_empleado,
        dp.nombre,
        dp.ape_paterno,
        dp.ape_materno,
        dp.email,
        dp.telefono
      FROM usuarios u
      INNER JOIN profesor p ON u.id_relacion = p.id_Profesor
      INNER JOIN empleado e ON p.id_empleado = e.id_empleado
      INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'PROFESOR'
      LIMIT 3
    `);
    console.table(relacionProf);

    // 4. Ver si los coordinadores tienen empleado y datos personales
    console.log('\n👥 VERIFICANDO COORDINADORES:');
    const [coordCheck] = await pool.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.id_relacion,
        c.id_Coordinador,
        c.id_empleado,
        e.id_dp,
        dp.nombre,
        dp.ape_paterno
      FROM usuarios u
      LEFT JOIN coordinador c ON u.id_relacion = c.id_Coordinador
      LEFT JOIN empleado e ON c.id_empleado = e.id_empleado
      LEFT JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'COORDINADOR'
      LIMIT 3
    `);
    console.log('Primeros 3 coordinadores:');
    console.table(coordCheck);

    // 5. Ver si los directivos tienen empleado y datos personales
    console.log('\n👔 VERIFICANDO DIRECTIVOS:');
    const [dirCheck] = await pool.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.id_relacion,
        d.id_Directivo,
        d.id_empleado,
        e.id_dp,
        dp.nombre,
        dp.ape_paterno
      FROM usuarios u
      LEFT JOIN directivo d ON u.id_relacion = d.id_Directivo
      LEFT JOIN empleado e ON d.id_empleado = e.id_empleado
      LEFT JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'DIRECTIVO'
    `);
    console.table(dirCheck);

    console.log('\n' + '='.repeat(80));
    console.log('✅ VERIFICACIÓN COMPLETADA\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verificarDatosPersonales();
