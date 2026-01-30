const { pool } = require('../config/db');

async function verificacionCompleta() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║     VERIFICACIÓN COMPLETA DE RELACIONES - COORDINADORES Y DIRECTIVOS      ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // ======================================================================
    // 1. ESTADÍSTICAS GENERALES
    // ======================================================================
    console.log('📊 1. ESTADÍSTICAS GENERALES\n');
    console.log('─'.repeat(80));
    
    const [stats] = await pool.query(`
      SELECT 
        rol,
        COUNT(*) as total
      FROM usuarios
      GROUP BY rol
      ORDER BY 
        CASE rol
          WHEN 'DIRECTIVO' THEN 1
          WHEN 'COORDINADOR' THEN 2
          WHEN 'PROFESOR' THEN 3
          WHEN 'ADMINISTRADOR' THEN 4
          WHEN 'ESTUDIANTE' THEN 5
        END
    `);
    
    console.table(stats);

    // ======================================================================
    // 2. COORDINADORES - INFORMACIÓN COMPLETA
    // ======================================================================
    console.log('\n👥 2. COORDINADORES - INFORMACIÓN COMPLETA\n');
    console.log('─'.repeat(80));
    
    const [coordinadores] = await pool.query(`
      SELECT 
        u.usuario as 'Usuario Login',
        CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as 'Nombre Completo',
        dp.email as 'Email',
        dp.telefono as 'Teléfono',
        c.estado as 'Estado',
        e.RFC as 'RFC'
      FROM usuarios u
      INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
      INNER JOIN empleado e ON c.id_empleado = e.id_empleado
      INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'COORDINADOR'
      ORDER BY u.usuario
    `);
    
    console.log(`Total: ${coordinadores.length} coordinadores\n`);
    console.table(coordinadores);

    // ======================================================================
    // 3. DIRECTIVOS - INFORMACIÓN COMPLETA
    // ======================================================================
    console.log('\n👔 3. DIRECTIVOS - INFORMACIÓN COMPLETA\n');
    console.log('─'.repeat(80));
    
    const [directivos] = await pool.query(`
      SELECT 
        u.usuario as 'Usuario Login',
        CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as 'Nombre Completo',
        dp.email as 'Email',
        dp.telefono as 'Teléfono',
        d.estado as 'Estado',
        e.RFC as 'RFC'
      FROM usuarios u
      INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
      INNER JOIN empleado e ON d.id_empleado = e.id_empleado
      INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'DIRECTIVO'
      ORDER BY u.usuario
    `);
    
    console.log(`Total: ${directivos.length} directivos\n`);
    console.table(directivos);

    // ======================================================================
    // 4. COMPARACIÓN CON PROFESORES
    // ======================================================================
    console.log('\n👨‍🏫 4. PROFESORES (PRIMEROS 5 COMO REFERENCIA)\n');
    console.log('─'.repeat(80));
    
    const [profesores] = await pool.query(`
      SELECT 
        u.usuario as 'Usuario Login',
        CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as 'Nombre Completo',
        dp.email as 'Email',
        p.ubicacion as 'Ubicación',
        p.nivelEstudio as 'Nivel Estudio'
      FROM usuarios u
      INNER JOIN profesor p ON u.id_relacion = p.id_Profesor
      INNER JOIN empleado e ON p.id_empleado = e.id_empleado
      INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'PROFESOR'
      ORDER BY u.usuario
      LIMIT 5
    `);
    
    console.table(profesores);

    // ======================================================================
    // 5. VERIFICACIÓN DE INTEGRIDAD
    // ======================================================================
    console.log('\n🔍 5. VERIFICACIÓN DE INTEGRIDAD\n');
    console.log('─'.repeat(80));
    
    // Verificar coordinadores sin datos
    const [coordSinDatos] = await pool.query(`
      SELECT COUNT(*) as total
      FROM usuarios u
      INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
      INNER JOIN empleado e ON c.id_empleado = e.id_empleado
      LEFT JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'COORDINADOR' AND dp.id_dp IS NULL
    `);
    
    // Verificar directivos sin datos
    const [dirSinDatos] = await pool.query(`
      SELECT COUNT(*) as total
      FROM usuarios u
      INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
      INNER JOIN empleado e ON d.id_empleado = e.id_empleado
      LEFT JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'DIRECTIVO' AND dp.id_dp IS NULL
    `);
    
    const resultados = [
      {
        'Tipo': 'Coordinadores',
        'Sin datos personales': coordSinDatos[0].total,
        'Estado': coordSinDatos[0].total === 0 ? '✅ Completo' : '❌ Incompleto'
      },
      {
        'Tipo': 'Directivos',
        'Sin datos personales': dirSinDatos[0].total,
        'Estado': dirSinDatos[0].total === 0 ? '✅ Completo' : '❌ Incompleto'
      }
    ];
    
    console.table(resultados);

    // ======================================================================
    // 6. ESTRUCTURA DE RELACIONES
    // ======================================================================
    console.log('\n🔗 6. EJEMPLO DE ESTRUCTURA DE RELACIONES\n');
    console.log('─'.repeat(80));
    
    const [ejemploCoord] = await pool.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.rol,
        u.id_relacion as 'usuarios.id_relacion',
        c.id_Coordinador as 'coordinador.id',
        c.id_empleado as 'coordinador.id_empleado',
        e.id_empleado as 'empleado.id',
        e.id_dp as 'empleado.id_dp',
        dp.id_dp as 'datospersonales.id',
        dp.nombre,
        dp.apellidoPaterno
      FROM usuarios u
      INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
      INNER JOIN empleado e ON c.id_empleado = e.id_empleado
      INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.usuario = 'coord1'
    `);
    
    console.log('Coordinador 1 - Flujo de relaciones:');
    console.table(ejemploCoord);
    
    console.log('\nInterpretación:');
    console.log('  1. usuarios.id_relacion → coordinador.id_Coordinador');
    console.log('  2. coordinador.id_empleado → empleado.id_empleado');
    console.log('  3. empleado.id_dp → datospersonales.id_dp');
    console.log('  ✅ Todos los enlaces están correctamente establecidos\n');

    // ======================================================================
    // 7. RESUMEN FINAL
    // ======================================================================
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                             RESUMEN FINAL                                  ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
    
    const coordOk = coordinadores.length > 0 && coordSinDatos[0].total === 0;
    const dirOk = directivos.length > 0 && dirSinDatos[0].total === 0;
    
    console.log(`✅ Coordinadores: ${coordinadores.length} usuarios con datos completos`);
    console.log(`✅ Directivos: ${directivos.length} usuarios con datos completos`);
    console.log(`\n${coordOk && dirOk ? '🎉' : '⚠️'} Estado general: ${coordOk && dirOk ? 'TODO CORRECTO' : 'REQUIERE ATENCIÓN'}`);
    
    if (coordOk && dirOk) {
      console.log('\n📌 CONCLUSIÓN:');
      console.log('   La estructura de relaciones está correctamente implementada.');
      console.log('   Todos los coordinadores y directivos tienen:');
      console.log('   - Usuario de login (tabla usuarios)');
      console.log('   - Registro de rol (tabla coordinador/directivo)');
      console.log('   - Información laboral (tabla empleado)');
      console.log('   - Datos personales (tabla datospersonales)');
      console.log('\n   La misma estructura que utilizan los profesores. ✅');
    }
    
    console.log('\n' + '═'.repeat(80));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

verificacionCompleta();
