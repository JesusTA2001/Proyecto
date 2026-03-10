const { pool } = require('./backend/config/db');

async function consultarSistemaEstudios() {
  try {
    console.log('🔍 Consultando sistema de preparación académica...\n');
    
    const [catalogoEstudios] = await pool.query(`
      SELECT id_Estudio, nivelEstudio 
      FROM CatalogoEstudios 
      ORDER BY id_Estudio
    `);
    
    console.log('📚 CATÁLOGO DE ESTUDIOS DISPONIBLES');
    console.log('═'.repeat(50));
    catalogoEstudios.forEach((estudio) => {
      console.log(`   ${estudio.id_Estudio}. ${estudio.nivelEstudio}`);
    });
    console.log(`   Total: ${catalogoEstudios.length} niveles\n`);
    
    console.log('═'.repeat(50));
    console.log('📋 ESTRUCTURA DE LA TABLA PREPARACION\n');
    
    const [estructura] = await pool.query('DESCRIBE Preparacion');
    console.table(estructura);
    
    console.log('═'.repeat(50));
    console.log('✅ Sistema listo para usar\n');
    
    console.log('💡 EJEMPLO DE USO:');
    console.log('   Para agregar un estudio a un profesor:\n');
    console.log('   INSERT INTO Preparacion (id_Profesor, id_Estudio, titulo, institucion, año_obtencion)');
    console.log('   VALUES (1, 2, \'Maestría en Lingüística Aplicada\', \'UNAM\', 2018);\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

consultarSistemaEstudios();
