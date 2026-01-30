const { pool } = require('./config/db');

async function agregarEstadoConcluido() {
  try {
    console.log('Modificando estructura de la tabla Grupo...\n');

    // Modificar el ENUM para agregar 'concluido'
    await pool.query(`
      ALTER TABLE Grupo 
      MODIFY COLUMN estado ENUM('activo', 'inactivo', 'concluido') DEFAULT 'activo'
    `);

    console.log('✅ Se agregó el valor "concluido" al campo estado\n');

    // Verificar la estructura actualizada
    const [estructura] = await pool.query(`DESCRIBE Grupo`);
    const estadoField = estructura.find(f => f.Field === 'estado');
    
    console.log('=== CAMPO ESTADO ACTUALIZADO ===');
    console.table([estadoField]);

    // Ahora marcar los grupos como concluidos
    console.log('\nMarcando Grupo 10 y Grupo 21 como concluidos...');
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

    console.log('=== GRUPOS ACTUALIZADOS ===');
    console.table(grupos);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

agregarEstadoConcluido();
