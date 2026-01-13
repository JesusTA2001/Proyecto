const { pool } = require('../config/db');

async function actualizarEstadoGrupo() {
  const connection = await pool.getConnection();
  
  try {
    console.log('=== Actualizando estado del estudiante 1000 ===\n');

    await connection.beginTransaction();

    // 1. Cambiar el estado del Grupo 1 (Intro) de 'actual' a 'concluido' (reprobado con calif < 70)
    console.log('📝 Cambiando estado del Grupo 1 (Intro) a "concluido"...');
    await connection.query(
      'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = 1000 AND id_Grupo = 1',
      ['concluido']
    );

    // 2. Eliminar la asignación al Grupo 21 (Nivel 6)
    console.log('❌ Eliminando asignación al Grupo 21 (Nivel 6)...');
    await connection.query(
      'DELETE FROM EstudianteGrupo WHERE nControl = 1000 AND id_Grupo = 22'
    );

    // 3. Asegurar que el nivel del estudiante es Intro (id_Nivel = 0)
    console.log('📝 Confirmando nivel del estudiante en Intro (id_Nivel = 0)...');
    await connection.query(
      'UPDATE Estudiante SET id_Nivel = 0 WHERE nControl = 1000'
    );

    await connection.commit();

    // Mostrar resultado final
    console.log('\n=== RESULTADO FINAL ===\n');
    
    const [estudiante] = await connection.query(`
      SELECT e.nControl, e.id_Nivel, n.nivel as nivel_nombre
      FROM Estudiante e
      LEFT JOIN Nivel n ON e.id_Nivel = n.id_Nivel
      WHERE e.nControl = 1000
    `);
    console.log('Datos del estudiante:');
    console.table(estudiante);

    const [grupos] = await connection.query(`
      SELECT eg.nControl, eg.id_Grupo, eg.estado, g.grupo, n.nivel
      FROM EstudianteGrupo eg
      JOIN Grupo g ON eg.id_Grupo = g.id_Grupo
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      WHERE eg.nControl = 1000
      ORDER BY eg.id_Grupo
    `);
    console.log('\nGrupos del estudiante:');
    console.table(grupos);

    const [calificaciones] = await connection.query(`
      SELECT c.id_Calificaciones, c.nControl, c.parcial1, c.parcial2, c.parcial3, c.final,
             n.nivel as nivel_nombre, c.id_Periodo, c.id_Grupo
      FROM Calificaciones c
      LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
      WHERE c.nControl = 1000
      ORDER BY c.id_Calificaciones
    `);
    console.log('\nCalificaciones del estudiante:');
    console.table(calificaciones);

    console.log('\n✅ Actualización completada');
    console.log('📌 Estado del estudiante 1000:');
    console.log('   - Nivel actual: Intro (reprobado con calificación 63)');
    console.log('   - Estado en grupo: reprobado');
    console.log('   - Debe aparecer en la lista de disponibles para Nivel Intro');
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error:', error);
  } finally {
    connection.release();
    process.exit();
  }
}

actualizarEstadoGrupo();
