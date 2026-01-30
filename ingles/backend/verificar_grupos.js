const { pool } = require('./config/db');

async function verificarGrupos() {
  try {
    console.log('Conectando a la base de datos...\n');

    // Verificar todos los grupos y su estado
    const [todosGrupos] = await pool.query(`
      SELECT 
        g.id_Grupo,
        g.grupo,
        g.estado,
        g.id_Periodo,
        p.descripcion as periodo_descripcion,
        n.nivel as nivel_nombre,
        (SELECT COUNT(*) FROM EstudianteGrupo eg WHERE eg.id_Grupo = g.id_Grupo) as num_alumnos
      FROM Grupo g
      LEFT JOIN Periodo p ON g.id_Periodo = p.id_Periodo
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      ORDER BY g.id_Grupo
    `);

    console.log('=== TODOS LOS GRUPOS ===');
    console.table(todosGrupos);

    // Buscar específicamente el Grupo 21 y Grupo 10
    console.log('\n=== GRUPO 21 Y GRUPO 10 ===');
    const [gruposEspecificos] = await pool.query(`
      SELECT 
        g.id_Grupo,
        g.grupo,
        g.estado,
        g.id_Periodo,
        p.descripcion as periodo_descripcion,
        p.año as periodo_año,
        n.nivel as nivel_nombre,
        (SELECT COUNT(*) FROM EstudianteGrupo eg WHERE eg.id_Grupo = g.id_Grupo) as num_alumnos
      FROM Grupo g
      LEFT JOIN Periodo p ON g.id_Periodo = p.id_Periodo
      LEFT JOIN Nivel n ON g.id_Nivel = n.id_Nivel
      WHERE g.grupo IN ('Grupo 21', 'Grupo 10')
      ORDER BY g.id_Grupo
    `);

    if (gruposEspecificos.length > 0) {
      console.table(gruposEspecificos);
    } else {
      console.log('❌ No se encontraron los grupos "Grupo 21" o "Grupo 10"');
    }

    // Contar grupos por estado
    console.log('\n=== RESUMEN POR ESTADO ===');
    const [resumen] = await pool.query(`
      SELECT 
        estado,
        COUNT(*) as cantidad
      FROM Grupo
      GROUP BY estado
    `);
    console.table(resumen);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verificarGrupos();
