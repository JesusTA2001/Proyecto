const { pool } = require('../config/db');

async function diagnosticarProblemaCalificaciones() {
  try {
    console.log('🔍 DIAGNÓSTICO DE PROBLEMA DE CALIFICACIONES\n');
    console.log('='.repeat(80));

    // 1. Ver estructura de la tabla calificaciones
    console.log('\n📋 1. ESTRUCTURA DE LA TABLA Calificaciones:');
    const [estructura] = await pool.query('DESCRIBE Calificaciones');
    console.table(estructura);

    // 2. Ver algunas calificaciones recientes
    console.log('\n📊 2. CALIFICACIONES RECIENTES (últimas 10):');
    const [recientes] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        c.id_Grupo,
        CONCAT(dp.apellidoPaterno, ' ', dp.nombre) as estudiante
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY c.id_Calificaciones DESC
      LIMIT 10
    `);
    console.table(recientes);

    // 3. Ver si hay calificaciones con parcial3 NULL
    console.log('\n⚠️  3. CALIFICACIONES CON PARCIAL3 NULL:');
    const [parcial3Null] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        CONCAT(dp.apellidoPaterno, ' ', dp.nombre) as estudiante
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE c.parcial3 IS NULL
      LIMIT 10
    `);
    console.log(`Total con parcial3 NULL: ${parcial3Null.length}`);
    if (parcial3Null.length > 0) {
      console.table(parcial3Null);
    }

    // 4. Buscar un caso específico para pruebas
    console.log('\n🔍 4. BUSCAR ESTUDIANTE CON CALIFICACIONES 100, 100, 100:');
    const [cien] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        c.id_Grupo,
        CONCAT(dp.apellidoPaterno, ' ', dp.nombre) as estudiante
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE c.parcial1 = 100 AND c.parcial2 = 100 AND c.parcial3 = 100
      LIMIT 5
    `);
    if (cien.length > 0) {
      console.log(`Encontrados ${cien.length} estudiantes con 100, 100, 100:`);
      console.table(cien);
    } else {
      console.log('No se encontraron estudiantes con 100, 100, 100');
    }

    // 5. Verificar si existe la tabla EstudianteCalificaciones
    console.log('\n📋 5. VERIFICAR TABLA EstudianteCalificaciones:');
    try {
      const [tablaIntermedia] = await pool.query('DESCRIBE EstudianteCalificaciones');
      console.log('✅ Tabla existe:');
      console.table(tablaIntermedia);
      
      const [countIntermedia] = await pool.query('SELECT COUNT(*) as total FROM EstudianteCalificaciones');
      console.log(`\nRegistros en EstudianteCalificaciones: ${countIntermedia[0].total}`);
    } catch (error) {
      console.log('❌ La tabla EstudianteCalificaciones no existe o tiene problemas');
    }

    // 6. Test de actualización
    console.log('\n' + '='.repeat(80));
    console.log('\n🧪 6. TEST DE ACTUALIZACIÓN:\n');
    
    // Buscar un registro para probar
    const [testRecord] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        CONCAT(dp.apellidoPaterno, ' ', dp.nombre) as estudiante
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE c.parcial1 IS NOT NULL AND c.parcial2 IS NOT NULL
      LIMIT 1
    `);
    
    if (testRecord.length > 0) {
      const record = testRecord[0];
      console.log('Registro de prueba seleccionado:');
      console.table([record]);
      
      console.log('\nIntentando actualizar parcial3 a 99...');
      const [updateResult] = await pool.query(
        'UPDATE Calificaciones SET parcial3 = 99 WHERE id_Calificaciones = ?',
        [record.id_Calificaciones]
      );
      console.log(`Filas afectadas: ${updateResult.affectedRows}`);
      
      // Verificar actualización
      const [verificar] = await pool.query(
        'SELECT parcial1, parcial2, parcial3, final FROM Calificaciones WHERE id_Calificaciones = ?',
        [record.id_Calificaciones]
      );
      console.log('\nDespués de actualizar:');
      console.table(verificar);
      
      if (verificar[0].parcial3 === 99) {
        console.log('✅ La actualización funcionó correctamente en la BD');
      } else {
        console.log('❌ La actualización NO se reflejó en la BD');
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ DIAGNÓSTICO COMPLETADO\n');
    console.log('📌 POSIBLES CAUSAS DEL PROBLEMA:');
    console.log('   1. Caché del frontend (no recarga datos actualizados)');
    console.log('   2. Múltiples registros duplicados en Calificaciones');
    console.log('   3. La consulta del estudiante lee de otra tabla');
    console.log('   4. Problema de sincronización entre peticiones');
    console.log('   5. El frontend no envía correctamente el parcial3');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

diagnosticarProblemaCalificaciones();
