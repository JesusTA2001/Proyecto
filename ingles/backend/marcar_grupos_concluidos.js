const { pool } = require('./config/db');

async function marcarGruposComoConcluidos() {
  try {
    console.log('Conectando a la base de datos...\n');

    // Actualizar Grupo 10 y Grupo 21 a estado 'concluido'
    const [result] = await pool.query(`
      UPDATE Grupo 
      SET estado = 'concluido' 
      WHERE grupo IN ('Grupo 10', 'Grupo 21')
    `);

    console.log(`✅ Se actualizaron ${result.affectedRows} grupos a estado 'concluido'\n`);

    // Verificar el cambio
    const [grupos] = await pool.query(`
      SELECT 
        g.id_Grupo,
        g.grupo,
        g.estado,
        p.descripcion as periodo,
        n.nivel as nivel,
        (SELECT COUNT(*) FROM EstudianteGrupo eg WHERE eg.id_Grupo = g.id_Grupo) as num_alumnos
      FROM Grupo g
      LEFT JOIN Periodo p ON g.id_Periodo = p.id_Periodo
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      WHERE g.grupo IN ('Grupo 10', 'Grupo 21')
    `);

    console.log('=== ESTADO ACTUAL DE LOS GRUPOS ===');
    console.table(grupos);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

marcarGruposComoConcluidos();
