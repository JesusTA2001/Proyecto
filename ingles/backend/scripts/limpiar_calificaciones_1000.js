const { pool } = require('../config/db');

async function limpiarCalificaciones() {
  const connection = await pool.getConnection();
  
  try {
    console.log('=== Limpiando calificaciones del estudiante 1000 ===\n');

    // 1. Mostrar calificaciones actuales del estudiante 1000
    console.log('Calificaciones actuales del estudiante 1000:');
    const [calificacionesActuales] = await connection.query(`
      SELECT c.id_Calificaciones, c.nControl, c.parcial1, c.parcial2, c.parcial3, c.final,
             n.nivel as nivel_nombre, c.id_nivel, c.id_Periodo, c.id_Grupo
      FROM Calificaciones c
      LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
      WHERE c.nControl = 1000
      ORDER BY c.id_Calificaciones
    `);
    console.table(calificacionesActuales);

    // 2. Mostrar grupos del estudiante 1000
    console.log('\nGrupos del estudiante 1000:');
    const [gruposActuales] = await connection.query(`
      SELECT eg.nControl, eg.id_Grupo, eg.estado, g.grupo, n.nivel
      FROM EstudianteGrupo eg
      JOIN Grupo g ON eg.id_Grupo = g.id_Grupo
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      WHERE eg.nControl = 1000
      ORDER BY eg.id_Grupo
    `);
    console.table(gruposActuales);

    await connection.beginTransaction();

    // 3. Eliminar calificaciones de nivel 2 (id_nivel = 2)
    const [calificacionesNivel2] = await connection.query(
      'SELECT id_Calificaciones FROM Calificaciones WHERE nControl = 1000 AND id_nivel = 2'
    );

    if (calificacionesNivel2.length > 0) {
      console.log(`\n❌ Eliminando ${calificacionesNivel2.length} calificación(es) de Nivel 2...`);
      
      for (const cal of calificacionesNivel2) {
        // Eliminar de tabla intermedia
        await connection.query(
          'DELETE FROM EstudianteCalificaciones WHERE id_Calificaciones = ?',
          [cal.id_Calificaciones]
        );
        
        // Eliminar calificación
        await connection.query(
          'DELETE FROM Calificaciones WHERE id_Calificaciones = ?',
          [cal.id_Calificaciones]
        );
      }
    }

    // 4. Eliminar grupos de nivel 2
    const [gruposNivel2] = await connection.query(`
      SELECT eg.id_Grupo 
      FROM EstudianteGrupo eg
      JOIN Grupo g ON eg.id_Grupo = g.id_Grupo
      WHERE eg.nControl = 1000 AND g.id_Nivel = 2
    `);

    if (gruposNivel2.length > 0) {
      console.log(`\n❌ Eliminando asignación a ${gruposNivel2.length} grupo(s) de Nivel 2...`);
      
      for (const grupo of gruposNivel2) {
        await connection.query(
          'DELETE FROM EstudianteGrupo WHERE nControl = 1000 AND id_Grupo = ?',
          [grupo.id_Grupo]
        );
      }
    }

    // 5. Actualizar el nivel del estudiante a Intro (id_Nivel = 0)
    console.log('\n📝 Actualizando nivel del estudiante a Intro (id_Nivel = 0)...');
    await connection.query(
      'UPDATE Estudiante SET id_Nivel = 0 WHERE nControl = 1000'
    );

    await connection.commit();

    // 6. Mostrar resultado final
    console.log('\n=== RESULTADO FINAL ===\n');
    
    console.log('Calificaciones restantes del estudiante 1000:');
    const [calificacionesFinales] = await connection.query(`
      SELECT c.id_Calificaciones, c.nControl, c.parcial1, c.parcial2, c.parcial3, c.final,
             n.nivel as nivel_nombre, c.id_nivel, c.id_Periodo, c.id_Grupo
      FROM Calificaciones c
      LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
      WHERE c.nControl = 1000
      ORDER BY c.id_Calificaciones
    `);
    console.table(calificacionesFinales);

    console.log('\nGrupos restantes del estudiante 1000:');
    const [gruposFinales] = await connection.query(`
      SELECT eg.nControl, eg.id_Grupo, eg.estado, g.grupo, n.nivel
      FROM EstudianteGrupo eg
      JOIN Grupo g ON eg.id_Grupo = g.id_Grupo
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      WHERE eg.nControl = 1000
      ORDER BY eg.id_Grupo
    `);
    console.table(gruposFinales);

    console.log('\n✅ Limpieza completada exitosamente');
    console.log('El estudiante 1000 ahora solo tiene calificaciones de Nivel Intro');
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error al limpiar calificaciones:', error);
  } finally {
    connection.release();
    process.exit();
  }
}

limpiarCalificaciones();
