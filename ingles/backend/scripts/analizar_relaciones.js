const { pool } = require('../config/db');

async function analizarRelaciones() {
  try {
    console.log('🔍 ANÁLISIS DE RELACIONES\n');
    console.log('='.repeat(80));

    // 1. Ver estructura de tabla empleado
    console.log('\n📋 ESTRUCTURA DE LA TABLA empleado:');
    const [empleadoStructure] = await pool.query('DESCRIBE empleado');
    console.table(empleadoStructure);

    // 2. Ver estructura de tabla profesor
    console.log('\n📋 ESTRUCTURA DE LA TABLA profesor:');
    const [profesorStructure] = await pool.query('DESCRIBE profesor');
    console.table(profesorStructure);

    // 3. Ver estructura de tabla coordinador
    console.log('\n📋 ESTRUCTURA DE LA TABLA coordinador:');
    const [coordinadorStructure] = await pool.query('DESCRIBE coordinador');
    console.table(coordinadorStructure);

    // 4. Ver estructura de tabla directivo
    console.log('\n📋 ESTRUCTURA DE LA TABLA directivo:');
    const [directivoStructure] = await pool.query('DESCRIBE directivo');
    console.table(directivoStructure);

    // 5. Ver datos en tabla empleado (primeros 5)
    console.log('\n👤 DATOS EN TABLA empleado (primeros 5):');
    const [empleados] = await pool.query('SELECT * FROM empleado LIMIT 5');
    console.table(empleados);

    // 6. Ver datos en tabla coordinador
    console.log('\n👥 DATOS EN TABLA coordinador:');
    const [coordinadorData] = await pool.query('SELECT * FROM coordinador');
    console.log(`Total registros: ${coordinadorData.length}`);
    if (coordinadorData.length > 0) {
      console.table(coordinadorData);
    } else {
      console.log('⚠️  LA TABLA ESTÁ VACÍA');
    }

    // 7. Ver datos en tabla directivo
    console.log('\n👔 DATOS EN TABLA directivo:');
    const [directivoData] = await pool.query('SELECT * FROM directivo');
    console.log(`Total registros: ${directivoData.length}`);
    if (directivoData.length > 0) {
      console.table(directivoData);
    } else {
      console.log('⚠️  LA TABLA ESTÁ VACÍA');
    }

    // 8. Ver relación completa de profesores: usuario -> empleado -> profesor
    console.log('\n🔗 RELACIÓN COMPLETA: USUARIOS -> EMPLEADO -> PROFESOR (primeros 3):');
    const [profesorCompleto] = await pool.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.rol,
        u.id_relacion as 'usuario.id_relacion',
        e.id_empleado,
        e.nombre,
        e.ape_paterno,
        e.ape_materno,
        e.email,
        e.telefono,
        p.id_Profesor,
        p.ubicacion,
        p.estado,
        p.nivelEstudio
      FROM usuarios u
      INNER JOIN profesor p ON u.id_relacion = p.id_Profesor
      INNER JOIN empleado e ON p.id_empleado = e.id_empleado
      WHERE u.rol = 'PROFESOR'
      LIMIT 3
    `);
    console.table(profesorCompleto);

    // 9. Ver cómo se conecta usuario con empleado
    console.log('\n🔗 ANÁLISIS: ¿Cómo se relaciona usuarios.id_relacion con profesor?');
    const [analisis] = await pool.query(`
      SELECT 
        'usuarios.id_relacion' as campo_origen,
        'profesor.id_Profesor' as campo_destino,
        'Luego profesor.id_empleado' as siguiente_relacion,
        'empleado.id_empleado' as tabla_datos_personales
    `);
    console.table(analisis);

    console.log('\n' + '='.repeat(80));
    console.log('✅ ANÁLISIS COMPLETADO');
    console.log('\n📌 CONCLUSIÓN:');
    console.log('   - Los PROFESORES tienen: usuarios -> profesor -> empleado');
    console.log('   - Los COORDINADORES solo tienen: usuarios (sin datos personales)');
    console.log('   - Los DIRECTIVOS solo tienen: usuarios (sin datos personales)');
    console.log('\n💡 SOLUCIÓN: Necesitamos crear la misma estructura para coordinadores y directivos');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

analizarRelaciones();
