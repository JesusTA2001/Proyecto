const { pool } = require('./backend/config/db');

async function consultarNiveles() {
  try {
    console.log('🔍 Consultando datos de la tabla Nivel...\n');
    
    const [niveles] = await pool.query(`
      SELECT 
        id_Nivel,
        nivel,
        campus
      FROM Nivel
      ORDER BY id_Nivel
    `);

    if (niveles.length === 0) {
      console.log('⚠️  La tabla Nivel está vacía, no hay datos.');
    } else {
      console.log(`📊 Total de niveles encontrados: ${niveles.length}\n`);
      
      // Niveles en ambos campus
      const compartidos = niveles.filter(n => n.campus.includes(','));
      if (compartidos.length > 0) {
        console.log('📚 AMBOS CAMPUS (Tecnológico y Centro de Idiomas)');
        console.log('═'.repeat(60));
        compartidos.forEach((nivel) => {
          console.log(`   ${nivel.id_Nivel.toString().padStart(2)} - ${nivel.nivel}`);
        });
        console.log(`   Total: ${compartidos.length} niveles\n`);
      }
      
      // Niveles solo del Centro de Idiomas
      const soloCI = niveles.filter(n => n.campus === 'Centro de Idiomas');
      if (soloCI.length > 0) {
        console.log('🎓 SOLO CENTRO DE IDIOMAS');
        console.log('═'.repeat(60));
        soloCI.forEach((nivel) => {
          console.log(`   ${nivel.id_Nivel.toString().padStart(2)} - ${nivel.nivel}`);
        });
        console.log(`   Total: ${soloCI.length} niveles\n`);
      }
      
      console.log('═'.repeat(60));
      console.log('✅ Consulta completada exitosamente');
    }

  } catch (error) {
    console.error('❌ Error al consultar niveles:', error.message);
  } finally {
    await pool.end();
  }
}

consultarNiveles();
