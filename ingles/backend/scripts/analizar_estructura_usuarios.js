const { pool } = require('../config/db');

async function analizarEstructura() {
  try {
    console.log('🔍 ANALIZANDO ESTRUCTURA DE LA BASE DE DATOS\n');
    console.log('='.repeat(60));

    // 1. Ver estructura de la tabla usuarios
    console.log('\n📋 1. ESTRUCTURA DE LA TABLA usuarios:');
    const [tableStructure] = await pool.query('DESCRIBE usuarios');
    console.table(tableStructure);

    // 2. Ver todos los usuarios coordinadores
    console.log('\n👥 2. USUARIOS COORDINADORES:');
    const [coordinadores] = await pool.query(`
      SELECT * FROM usuarios WHERE rol = 'coordinador' ORDER BY usuario
    `);
    console.log(`Total coordinadores: ${coordinadores.length}`);
    console.table(coordinadores);

    // 3. Ver todos los usuarios directivos
    console.log('\n👔 3. USUARIOS DIRECTIVOS:');
    const [directivos] = await pool.query(`
      SELECT * FROM usuarios WHERE rol = 'directivo' ORDER BY usuario
    `);
    console.log(`Total directivos: ${directivos.length}`);
    console.table(directivos);

    // 4. Ver estructura de profesores y cómo se relacionan
    console.log('\n👨‍🏫 4. ESTRUCTURA DE PROFESORES:');
    const [profesores] = await pool.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.rol,
        u.id_relacion,
        p.id_profesor,
        p.nombre,
        p.ape_paterno,
        p.ape_materno,
        p.email,
        p.telefono,
        p.especialidad
      FROM usuarios u
      LEFT JOIN profesores p ON u.id_relacion = p.id_profesor
      WHERE u.rol = 'profesor'
      LIMIT 5
    `);
    console.log('Ejemplo de profesores con sus datos personales:');
    console.table(profesores);

    // 5. Ver todas las tablas de la base de datos
    console.log('\n📊 5. TODAS LAS TABLAS EN LA BASE DE DATOS:');
    const [tables] = await pool.query('SHOW TABLES');
    console.table(tables);

    // 6. Ver si existe tabla de coordinadores
    console.log('\n🔍 6. VERIFICANDO TABLA COORDINADORES:');
    try {
      const [coordTable] = await pool.query('DESCRIBE coordinadores');
      console.log('✅ Tabla coordinadores existe:');
      console.table(coordTable);
    } catch (error) {
      console.log('❌ Tabla coordinadores NO existe');
    }

    // 7. Ver si existe tabla de directivos
    console.log('\n🔍 7. VERIFICANDO TABLA DIRECTIVOS:');
    try {
      const [dirTable] = await pool.query('DESCRIBE directivos');
      console.log('✅ Tabla directivos existe:');
      console.table(dirTable);
    } catch (error) {
      console.log('❌ Tabla directivos NO existe');
    }

    // 8. Ver estructura de la tabla profesores
    console.log('\n📋 8. ESTRUCTURA DE LA TABLA profesores:');
    const [profStructure] = await pool.query('DESCRIBE profesores');
    console.table(profStructure);

    console.log('\n' + '='.repeat(60));
    console.log('✅ ANÁLISIS COMPLETADO');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

analizarEstructura();
