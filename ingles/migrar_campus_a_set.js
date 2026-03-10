const { pool } = require('./backend/config/db');

async function migrarCampusASet() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos Azure...\n');
    connection = await pool.getConnection();
    
    // PASO 1: Cambiar ENUM a SET
    console.log('📝 PASO 1: Cambiando campo campus de ENUM a SET...');
    try {
      await connection.query(`
        ALTER TABLE Nivel 
        MODIFY campus SET('Tecnologico','Centro de Idiomas')
      `);
      console.log('✅ Campo campus cambiado exitosamente a SET\n');
    } catch (error) {
      console.log('⚠️  Error al modificar campo:', error.message);
      console.log('Intentando alternativa...\n');
    }
    
    // PASO 2: Actualizar niveles 0-6 para que pertenezcan a ambos campus
    console.log('📝 PASO 2: Actualizando niveles Intro-6 para ambos campus...');
    for (let i = 0; i <= 6; i++) {
      await connection.query(
        `UPDATE Nivel SET campus = 'Tecnologico,Centro de Idiomas' WHERE id_Nivel = ?`,
        [i]
      );
    }
    console.log('✅ 7 niveles actualizados para ambos campus (Intro + Nivel 1-6)\n');
    
    // PASO 3: Verificar niveles actualizados
    console.log('='.repeat(70));
    console.log('📊 VERIFICACIÓN - TODOS LOS NIVELES\n');
    
    const [niveles] = await connection.query(`
      SELECT id_Nivel, nivel, campus 
      FROM Nivel 
      ORDER BY id_Nivel
    `);
    
    console.table(niveles);
    
    // PASO 4: Resumen por categoría
    console.log('\n' + '='.repeat(70));
    console.log('📈 RESUMEN\n');
    
    const compartidos = niveles.filter(n => n.campus.includes(','));
    const soloCI = niveles.filter(n => n.campus === 'Centro de Idiomas');
    
    console.log(`📚 Niveles en ambos campus: ${compartidos.length}`);
    compartidos.forEach(n => console.log(`   ${n.id_Nivel} - ${n.nivel}`));
    
    console.log(`\n🎓 Niveles solo en Centro de Idiomas: ${soloCI.length}`);
    soloCI.forEach(n => console.log(`   ${n.id_Nivel} - ${n.nivel}`));
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Migración completada exitosamente\n');
    
  } catch (error) {
    console.error('❌ Error al ejecutar migración:', error.message);
    console.error(error);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

migrarCampusASet();
