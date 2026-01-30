const { pool } = require('../config/db');

async function simularProblemaCalificaciones() {
  try {
    console.log('🧪 SIMULACIÓN DEL PROBLEMA DE CALIFICACIONES\n');
    console.log('='.repeat(80));

    // 1. Buscar un estudiante con calificaciones 100, 100, 100
    console.log('\n📋 1. BUSCANDO ESTUDIANTE CON 100, 100, 100:\n');
    const [estudiante] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        c.id_Grupo,
        CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) as estudiante_nombre
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE c.parcial1 = 100 AND c.parcial2 = 100 AND c.parcial3 = 100
      LIMIT 1
    `);

    if (estudiante.length === 0) {
      console.log('❌ No hay estudiantes con 100, 100, 100');
      console.log('Creando uno para la prueba...\n');
      
      // Buscar cualquier estudiante
      const [anyStudent] = await pool.query(`
        SELECT e.nControl, eg.id_Grupo, g.id_Periodo, g.id_Nivel
        FROM Estudiante e
        JOIN EstudianteGrupo eg ON e.nControl = eg.nControl
        JOIN Grupo g ON eg.id_Grupo = g.id_Grupo
        WHERE eg.estado = 'activo'
        LIMIT 1
      `);

      if (anyStudent.length === 0) {
        console.log('❌ No hay estudiantes activos para probar');
        return;
      }

      const nControl = anyStudent[0].nControl;
      const id_Grupo = anyStudent[0].id_Grupo;
      const id_Periodo = anyStudent[0].id_Periodo;
      const id_nivel = anyStudent[0].id_Nivel;

      // Insertar o actualizar calificaciones a 100, 100, 100
      const [existe] = await pool.query(
        'SELECT id_Calificaciones FROM Calificaciones WHERE nControl = ? AND id_Grupo = ?',
        [nControl, id_Grupo]
      );

      if (existe.length > 0) {
        await pool.query(
          'UPDATE Calificaciones SET parcial1 = 100, parcial2 = 100, parcial3 = 100, final = 100 WHERE id_Calificaciones = ?',
          [existe[0].id_Calificaciones]
        );
        console.log(`✅ Actualizado estudiante nControl=${nControl} a 100, 100, 100`);
      } else {
        const [result] = await pool.query(
          'INSERT INTO Calificaciones (nControl, parcial1, parcial2, parcial3, final, id_nivel, id_Periodo, id_Grupo) VALUES (?, 100, 100, 100, 100, ?, ?, ?)',
          [nControl, id_nivel, id_Periodo, id_Grupo]
        );
        await pool.query(
          'INSERT INTO EstudianteCalificaciones (nControl, id_Calificaciones) VALUES (?, ?)',
          [nControl, result.insertId]
        );
        console.log(`✅ Creado estudiante nControl=${nControl} con 100, 100, 100`);
      }

      // Volver a consultar
      const [nuevoEstudiante] = await pool.query(`
        SELECT 
          c.id_Calificaciones,
          c.nControl,
          c.parcial1,
          c.parcial2,
          c.parcial3,
          c.final,
          c.id_Grupo,
          CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) as estudiante_nombre
        FROM Calificaciones c
        JOIN Estudiante e ON c.nControl = e.nControl
        JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
        WHERE c.nControl = ?
      `, [nControl]);

      estudiante[0] = nuevoEstudiante[0];
    }

    const record = estudiante[0];
    console.log('Estudiante seleccionado:');
    console.table([record]);

    // 2. Simular cambio a 88, 88, 88 (como el profesor)
    console.log('\n' + '='.repeat(80));
    console.log('\n📝 2. SIMULANDO CAMBIO DEL PROFESOR (100→88):\n');
    
    console.log('Actualizando parcial1 a 88...');
    await pool.query(
      'UPDATE Calificaciones SET parcial1 = 88, final = 88 WHERE id_Calificaciones = ?',
      [record.id_Calificaciones]
    );
    
    console.log('Actualizando parcial2 a 88...');
    await pool.query(
      'UPDATE Calificaciones SET parcial2 = 88, final = 88 WHERE id_Calificaciones = ?',
      [record.id_Calificaciones]
    );
    
    console.log('Actualizando parcial3 a 88...');
    await pool.query(
      'UPDATE Calificaciones SET parcial3 = 88, final = 88 WHERE id_Calificaciones = ?',
      [record.id_Calificaciones]
    );

    // 3. Verificar lo que ve el profesor
    console.log('\n' + '='.repeat(80));
    console.log('\n👨‍🏫 3. LO QUE VE EL PROFESOR (consulta de grupo):\n');
    
    const [vistaProfesor] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) as estudiante_nombre
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      WHERE c.id_Calificaciones = ?
    `, [record.id_Calificaciones]);
    
    console.table(vistaProfesor);

    // 4. Verificar lo que ve el estudiante
    console.log('\n👨‍🎓 4. LO QUE VE EL ESTUDIANTE (consulta por nControl):\n');
    
    const [vistaEstudiante] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        c.id_nivel,
        c.id_Periodo,
        c.id_Grupo,
        n.nivel as nivel_nombre,
        p.descripcion as periodo_nombre,
        g.grupo as grupo_nombre
      FROM Calificaciones c
      LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
      LEFT JOIN Periodo p ON c.id_Periodo = p.id_Periodo
      LEFT JOIN Grupo g ON c.id_Grupo = g.id_Grupo
      WHERE c.nControl = ?
      ORDER BY c.id_Periodo DESC, c.id_Grupo
    `, [record.nControl]);
    
    console.table(vistaEstudiante);

    // 5. Verificar si hay registros duplicados
    console.log('\n' + '='.repeat(80));
    console.log('\n🔍 5. VERIFICAR REGISTROS DUPLICADOS:\n');
    
    const [duplicados] = await pool.query(`
      SELECT 
        id_Calificaciones,
        nControl,
        parcial1,
        parcial2,
        parcial3,
        id_Grupo,
        id_Periodo
      FROM Calificaciones
      WHERE nControl = ?
      ORDER BY id_Calificaciones DESC
    `, [record.nControl]);
    
    console.log(`Total de registros para nControl ${record.nControl}: ${duplicados.length}`);
    console.table(duplicados);

    if (duplicados.length > 1) {
      console.log('\n⚠️  HAY REGISTROS DUPLICADOS!');
      console.log('Esto puede causar que el estudiante vea calificaciones antiguas.');
    }

    // 6. Probar parcial3 específicamente
    console.log('\n' + '='.repeat(80));
    console.log('\n🧪 6. TEST ESPECÍFICO DE PARCIAL3:\n');
    
    console.log('Estado actual del parcial3:');
    const [parcial3Antes] = await pool.query(
      'SELECT parcial3 FROM Calificaciones WHERE id_Calificaciones = ?',
      [record.id_Calificaciones]
    );
    console.log(`Valor actual: ${parcial3Antes[0].parcial3}`);
    
    console.log('\nActualizando parcial3 a 77...');
    await pool.query(
      'UPDATE Calificaciones SET parcial3 = 77 WHERE id_Calificaciones = ?',
      [record.id_Calificaciones]
    );
    
    console.log('Verificando cambio...');
    const [parcial3Despues] = await pool.query(
      'SELECT parcial3 FROM Calificaciones WHERE id_Calificaciones = ?',
      [record.id_Calificaciones]
    );
    console.log(`Valor después: ${parcial3Despues[0].parcial3}`);
    
    if (parcial3Despues[0].parcial3 === 77) {
      console.log('✅ Parcial3 se actualiza correctamente');
    } else {
      console.log('❌ Parcial3 NO se actualizó correctamente');
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n📌 CONCLUSIONES:\n');
    
    if (duplicados.length > 1) {
      console.log('⚠️  PROBLEMA ENCONTRADO: Registros duplicados en Calificaciones');
      console.log('   - El profesor actualiza un registro');
      console.log('   - El estudiante lee otro registro (más antiguo)');
      console.log('   - Solución: Eliminar duplicados o usar WHERE más específico');
    } else if (vistaProfesor[0].parcial3 === vistaEstudiante[0].parcial3) {
      console.log('✅ NO HAY PROBLEMA EN LA BASE DE DATOS');
      console.log('   - Ambos ven los mismos datos');
      console.log('   - El problema es CACHÉ DEL FRONTEND');
      console.log('   - Solución: Forzar recarga de datos después de actualizar');
    } else {
      console.log('⚠️  Hay una discrepancia entre las consultas');
      console.log('   - Verificar las consultas en el frontend');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

simularProblemaCalificaciones();
