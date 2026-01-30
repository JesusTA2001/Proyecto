const { pool } = require('../config/db');

async function diagnosticarProblemaReal() {
  try {
    console.log('🔍 DIAGNÓSTICO DEL PROBLEMA REAL DE CALIFICACIONES\n');
    console.log('='.repeat(80));

    // 1. Buscar estudiantes con parcial3 NULL
    console.log('\n📋 1. ESTUDIANTES CON PARCIAL3 NULL:\n');
    
    const [parcial3Null] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        c.id_Grupo,
        g.grupo as nombre_grupo,
        CONCAT(dp.apellidoPaterno, ' ', dp.nombre) as estudiante
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      JOIN Grupo g ON c.id_Grupo = g.id_Grupo
      WHERE c.parcial3 IS NULL 
        AND c.parcial1 IS NOT NULL 
        AND c.parcial2 IS NOT NULL
      ORDER BY c.id_Calificaciones DESC
      LIMIT 10
    `);
    
    console.log(`Total con parcial1 y parcial2 pero SIN parcial3: ${parcial3Null.length}`);
    if (parcial3Null.length > 0) {
      console.table(parcial3Null);
    }

    // 2. Verificar la API de guardar individual
    console.log('\n' + '='.repeat(80));
    console.log('\n🧪 2. TEST DE GUARDAR PARCIAL3 INDIVIDUAL:\n');
    
    if (parcial3Null.length > 0) {
      const testCase = parcial3Null[0];
      console.log(`Probando con estudiante: ${testCase.estudiante}`);
      console.log(`nControl: ${testCase.nControl}`);
      console.log(`id_Grupo: ${testCase.id_Grupo}`);
      console.log(`Grupo: ${testCase.nombre_grupo}`);
      console.log(`\nCalificaciones actuales:`);
      console.log(`  Parcial 1: ${testCase.parcial1}`);
      console.log(`  Parcial 2: ${testCase.parcial2}`);
      console.log(`  Parcial 3: ${testCase.parcial3}`);
      console.log(`  Final: ${testCase.final}`);

      // Obtener info completa del grupo
      const [grupoInfo] = await pool.query(`
        SELECT id_Nivel, id_Periodo FROM Grupo WHERE id_Grupo = ?
      `, [testCase.id_Grupo]);

      if (grupoInfo.length > 0) {
        console.log(`\nActualizando parcial3 a 95...`);
        
        // Simular la actualización como lo haría la API
        const [updateResult] = await pool.query(
          'UPDATE Calificaciones SET parcial3 = 95, final = ROUND((COALESCE(parcial1,0) + COALESCE(parcial2,0) + 95)/3) WHERE id_Calificaciones = ?',
          [testCase.id_Calificaciones]
        );
        
        console.log(`Filas afectadas: ${updateResult.affectedRows}`);

        // Verificar el cambio
        const [despues] = await pool.query(
          'SELECT parcial1, parcial2, parcial3, final FROM Calificaciones WHERE id_Calificaciones = ?',
          [testCase.id_Calificaciones]
        );

        console.log(`\nDespués de actualizar:`);
        console.table(despues);

        if (despues[0].parcial3 === 95) {
          console.log('✅ La actualización funcionó correctamente');
        } else {
          console.log('❌ La actualización NO funcionó');
        }
      }
    } else {
      console.log('No hay casos con parcial3 NULL para probar');
    }

    // 3. Verificar si hay problema de timing/concurrencia
    console.log('\n' + '='.repeat(80));
    console.log('\n⏱️  3. VERIFICAR PROBLEMA DE TIMING:\n');
    
    console.log('Posibles causas del problema:');
    console.log('  1. ❌ El frontend no envía el valor de parcial3');
    console.log('  2. ❌ El backend no procesa correctamente parcial3');
    console.log('  3. ❌ Hay un WHERE incorrecto que actualiza otro registro');
    console.log('  4. ❌ El frontend tiene datos en caché');
    console.log('  5. ❌ El estudiante está viendo datos de otro período/grupo');

    // 4. Comparar queries del profesor vs estudiante
    console.log('\n' + '='.repeat(80));
    console.log('\n🔍 4. COMPARAR QUERIES PROFESOR VS ESTUDIANTE:\n');

    // Buscar un estudiante con calificaciones
    const [estudiante] = await pool.query(`
      SELECT DISTINCT c.nControl, c.id_Grupo
      FROM Calificaciones c
      WHERE c.parcial1 IS NOT NULL
      LIMIT 1
    `);

    if (estudiante.length > 0) {
      const nControl = estudiante[0].nControl;
      const id_Grupo = estudiante[0].id_Grupo;

      console.log(`\nEstudiante de prueba: nControl=${nControl}, Grupo=${id_Grupo}\n`);

      // Query que usa el PROFESOR (por grupo)
      console.log('Query del PROFESOR (getCalificacionesGrupo):');
      const [vistaProfesor] = await pool.query(`
        SELECT 
          c.id_Calificaciones,
          c.nControl,
          c.parcial1,
          c.parcial2,
          c.parcial3,
          c.final
        FROM Calificaciones c
        WHERE c.id_Grupo = ? AND c.nControl = ?
      `, [id_Grupo, nControl]);
      console.table(vistaProfesor);

      // Query que usa el ESTUDIANTE (por nControl)
      console.log('\nQuery del ESTUDIANTE (getCalificacionesEstudiante):');
      const [vistaEstudiante] = await pool.query(`
        SELECT 
          c.id_Calificaciones,
          c.nControl,
          c.parcial1,
          c.parcial2,
          c.parcial3,
          c.final,
          c.id_Grupo
        FROM Calificaciones c
        WHERE c.nControl = ?
        ORDER BY c.id_Periodo DESC, c.id_Grupo
      `, [nControl]);
      console.table(vistaEstudiante);

      if (vistaProfesor.length > 0 && vistaEstudiante.length > 0) {
        const profReg = vistaProfesor[0];
        const estudReg = vistaEstudiante.find(e => e.id_Grupo === id_Grupo);

        if (estudReg) {
          console.log('\n📊 COMPARACIÓN:');
          console.log(`  Profesor ve registro: ${profReg.id_Calificaciones}`);
          console.log(`  Estudiante ve registro: ${estudReg.id_Calificaciones}`);
          
          if (profReg.id_Calificaciones === estudReg.id_Calificaciones) {
            console.log('  ✅ Ambos ven el MISMO registro');
            
            if (profReg.parcial3 === estudReg.parcial3) {
              console.log('  ✅ Y tienen el MISMO valor de parcial3');
              console.log('\n  💡 El problema es CACHÉ DEL FRONTEND');
            } else {
              console.log('  ❌ Pero tienen DIFERENTE valor de parcial3');
            }
          } else {
            console.log('  ❌ VEN REGISTROS DIFERENTES!');
            console.log('  💡 Este es el problema raíz');
          }
        }
      }
    }

    // 5. Recomendaciones
    console.log('\n' + '='.repeat(80));
    console.log('\n💡 5. RECOMENDACIONES:\n');
    
    console.log('Para solucionar el problema:');
    console.log('');
    console.log('A) Si el problema es PARCIAL3 NO SE GUARDA:');
    console.log('   1. Verificar logs del backend cuando se guarda');
    console.log('   2. Agregar console.log en guardarCalificacionIndividual');
    console.log('   3. Ver en Network tab del navegador qué se envía');
    console.log('');
    console.log('B) Si el problema es ESTUDIANTE VE DATOS VIEJOS:');
    console.log('   1. Deshabilitar caché del navegador (Ctrl+Shift+R)');
    console.log('   2. Agregar timestamp a las peticiones API');
    console.log('   3. Forzar revalidación con force-reload header');
    console.log('');
    console.log('C) Para debugging en tiempo real:');
    console.log('   1. Agregar logs en AsignarCalificaciones.js');
    console.log('   2. Ver exactamente qué se envía en savePartialImmediate');
    console.log('   3. Verificar que parcialKey sea "parcial3"');

    console.log('\n' + '='.repeat(80));
    console.log('\n📝 SIGUIENTE PASO:');
    console.log('   Agregar logs de debugging al backend para ver qué recibe');
    console.log('\n   Ejecuta: node scripts/agregar_logs_debugging.js');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

diagnosticarProblemaReal();
