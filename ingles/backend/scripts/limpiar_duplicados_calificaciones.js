const { pool } = require('../config/db');

async function limpiarDuplicados() {
  let connection;
  
  try {
    console.log('🔧 LIMPIEZA DE CALIFICACIONES DUPLICADAS\n');
    console.log('='.repeat(80));

    connection = await pool.getConnection();

    // 1. Identificar duplicados
    console.log('\n🔍 1. IDENTIFICANDO DUPLICADOS:\n');
    
    const [duplicados] = await connection.query(`
      SELECT 
        nControl,
        id_Grupo,
        id_Periodo,
        COUNT(*) as cantidad,
        GROUP_CONCAT(id_Calificaciones ORDER BY id_Calificaciones DESC) as ids
      FROM Calificaciones
      GROUP BY nControl, id_Grupo, id_Periodo
      HAVING COUNT(*) > 1
      ORDER BY cantidad DESC
    `);

    console.log(`Total de casos con duplicados: ${duplicados.length}\n`);
    
    if (duplicados.length === 0) {
      console.log('✅ NO HAY DUPLICADOS. Todo está limpio.');
      return;
    }

    console.log('Primeros 10 casos:');
    console.table(duplicados.slice(0, 10));

    // 2. Contar total de registros a eliminar
    let totalAEliminar = duplicados.reduce((sum, d) => sum + (d.cantidad - 1), 0);
    console.log(`\n📊 Total de registros duplicados a eliminar: ${totalAEliminar}`);

    // Confirmar
    console.log('\n⚠️  ADVERTENCIA: Se eliminarán los registros duplicados');
    console.log('   Se conservará solo el MÁS RECIENTE de cada grupo');
    console.log('\nIniciando limpieza en 3 segundos...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    await connection.beginTransaction();

    // 3. Limpiar duplicados
    console.log('\n🧹 3. LIMPIANDO DUPLICADOS:\n');
    
    let eliminados = 0;
    let errores = 0;

    for (const dup of duplicados) {
      try {
        const ids = dup.ids.split(',').map(id => parseInt(id));
        const masReciente = ids[0]; // El primero es el más reciente (ORDER BY DESC)
        const paraEliminar = ids.slice(1); // El resto se eliminan

        console.log(`\nnControl: ${dup.nControl}, Grupo: ${dup.id_Grupo}, Periodo: ${dup.id_Periodo}`);
        console.log(`  IDs: ${dup.ids}`);
        console.log(`  Manteniendo: ${masReciente}`);
        console.log(`  Eliminando: ${paraEliminar.join(', ')}`);

        // Ver los valores antes de eliminar
        const [registros] = await connection.query(`
          SELECT id_Calificaciones, parcial1, parcial2, parcial3, final
          FROM Calificaciones
          WHERE id_Calificaciones IN (${ids.join(',')})
          ORDER BY id_Calificaciones DESC
        `);
        
        console.log('  Valores:');
        registros.forEach((r, idx) => {
          const etiqueta = idx === 0 ? '✅ MANTENER' : '❌ ELIMINAR';
          console.log(`    ${etiqueta} [${r.id_Calificaciones}]: P1=${r.parcial1}, P2=${r.parcial2}, P3=${r.parcial3}, F=${r.final}`);
        });

        // Eliminar de tabla intermedia primero
        for (const id of paraEliminar) {
          await connection.query(
            'DELETE FROM EstudianteCalificaciones WHERE id_Calificaciones = ?',
            [id]
          );
        }

        // Eliminar calificaciones duplicadas
        for (const id of paraEliminar) {
          await connection.query(
            'DELETE FROM Calificaciones WHERE id_Calificaciones = ?',
            [id]
          );
          eliminados++;
        }

      } catch (error) {
        console.error(`  ❌ Error en nControl ${dup.nControl}:`, error.message);
        errores++;
      }
    }

    await connection.commit();

    // 4. Verificar resultado
    console.log('\n' + '='.repeat(80));
    console.log('\n✅ 4. VERIFICACIÓN POST-LIMPIEZA:\n');
    
    const [verificar] = await connection.query(`
      SELECT 
        nControl,
        id_Grupo,
        id_Periodo,
        COUNT(*) as cantidad
      FROM Calificaciones
      GROUP BY nControl, id_Grupo, id_Periodo
      HAVING COUNT(*) > 1
    `);

    if (verificar.length === 0) {
      console.log('✅ ÉXITO: No quedan duplicados');
    } else {
      console.log(`⚠️  Aún quedan ${verificar.length} casos con duplicados`);
      console.table(verificar);
    }

    // 5. Estadísticas
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 ESTADÍSTICAS:\n');
    
    const [totalCalificaciones] = await connection.query(
      'SELECT COUNT(*) as total FROM Calificaciones'
    );
    
    console.log(`Registros eliminados: ${eliminados}`);
    console.log(`Errores: ${errores}`);
    console.log(`Total de calificaciones ahora: ${totalCalificaciones[0].total}`);

    // 6. Casos problemáticos (parcial3 NULL)
    console.log('\n' + '='.repeat(80));
    console.log('\n⚠️  6. REGISTROS CON PARCIAL3 NULL:\n');
    
    const [parcial3Null] = await connection.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.id_Grupo,
        CONCAT(dp.apellidoPaterno, ' ', dp.nombre) as estudiante
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE c.parcial3 IS NULL AND (c.parcial1 IS NOT NULL OR c.parcial2 IS NOT NULL)
      LIMIT 10
    `);
    
    if (parcial3Null.length > 0) {
      console.log(`Casos con parcial3 NULL: ${parcial3Null.length}`);
      console.table(parcial3Null);
      console.log('\n💡 NOTA: Estos pueden ser calificaciones incompletas normales');
      console.log('   (el parcial3 aún no se ha calificado)');
    } else {
      console.log('✅ No hay problemas con parcial3 NULL');
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n🎉 LIMPIEZA COMPLETADA EXITOSAMENTE\n');
    console.log('📌 PRÓXIMOS PASOS:');
    console.log('   1. Probar el login en el frontend');
    console.log('   2. Calificar un estudiante y verificar que se vea el cambio');
    console.log('   3. Considerar agregar constraint UNIQUE para prevenir duplicados');
    console.log('\nEjecuta: node scripts/agregar_constraint_unique.js');

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

limpiarDuplicados();
