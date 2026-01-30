const { pool } = require('../config/db');

async function analizarEstructura() {
  try {
    console.log('🔍 ANALIZANDO ESTRUCTURA DE LA BASE DE DATOS\n');
    console.log('='.repeat(60));

    // 1. Ver todas las tablas primero
    console.log('\n📊 TODAS LAS TABLAS EN LA BASE DE DATOS:');
    const [tables] = await pool.query('SHOW TABLES');
    console.table(tables);

    // 2. Ver estructura de la tabla usuarios
    console.log('\n📋 ESTRUCTURA DE LA TABLA usuarios:');
    const [tableStructure] = await pool.query('DESCRIBE usuarios');
    console.table(tableStructure);

    // 3. Ver todos los usuarios coordinadores
    console.log('\n👥 USUARIOS COORDINADORES:');
    const [coordinadores] = await pool.query(`
      SELECT * FROM usuarios WHERE rol = 'COORDINADOR' ORDER BY usuario
    `);
    console.log(`Total coordinadores: ${coordinadores.length}`);
    console.table(coordinadores);

    // 4. Ver todos los usuarios directivos
    console.log('\n👔 USUARIOS DIRECTIVOS:');
    const [directivos] = await pool.query(`
      SELECT * FROM usuarios WHERE rol = 'DIRECTIVO' ORDER BY usuario
    `);
    console.log(`Total directivos: ${directivos.length}`);
    console.table(directivos);

    // 5. Ver algunos usuarios profesores
    console.log('\n👨‍🏫 USUARIOS PROFESORES (primeros 3):');
    const [profesoresUsuarios] = await pool.query(`
      SELECT * FROM usuarios WHERE rol = 'PROFESOR' LIMIT 3
    `);
    console.table(profesoresUsuarios);

    // 6. Buscar tabla relacionada con profesores
    console.log('\n🔍 BUSCANDO TABLA DE PROFESORES:');
    const tableNames = tables.map(t => Object.values(t)[0]);
    const profesorTable = tableNames.find(t => t.toLowerCase().includes('prof'));
    console.log('Tabla de profesores encontrada:', profesorTable || 'NO ENCONTRADA');

    if (profesorTable) {
      console.log(`\n📋 ESTRUCTURA DE LA TABLA ${profesorTable}:`);
      const [profStructure] = await pool.query(`DESCRIBE ${profesorTable}`);
      console.table(profStructure);

      console.log(`\n👨‍🏫 DATOS EN LA TABLA ${profesorTable} (primeros 3):`);
      const [profData] = await pool.query(`SELECT * FROM ${profesorTable} LIMIT 3`);
      console.table(profData);

      // Ver cómo se relaciona con usuarios
      console.log(`\n🔗 RELACIÓN USUARIOS-PROFESORES:`);
      const [relation] = await pool.query(`
        SELECT 
          u.id_usuario,
          u.usuario,
          u.rol,
          u.id_relacion,
          p.*
        FROM usuarios u
        LEFT JOIN ${profesorTable} p ON u.id_relacion = p.id_profesor
        WHERE u.rol = 'PROFESOR'
        LIMIT 3
      `);
      console.table(relation);
    }

    // 7. Buscar si existe tabla de coordinadores
    const coordTable = tableNames.find(t => t.toLowerCase().includes('coord'));
    console.log('\n🔍 TABLA DE COORDINADORES:', coordTable || 'NO EXISTE');

    // 8. Buscar si existe tabla de directivos
    const dirTable = tableNames.find(t => t.toLowerCase().includes('direct'));
    console.log('🔍 TABLA DE DIRECTIVOS:', dirTable || 'NO EXISTE');

    // 9. Ver todos los roles disponibles
    console.log('\n📊 CONTEO DE USUARIOS POR ROL:');
    const [roleCount] = await pool.query(`
      SELECT rol, COUNT(*) as total
      FROM usuarios
      GROUP BY rol
      ORDER BY total DESC
    `);
    console.table(roleCount);

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
