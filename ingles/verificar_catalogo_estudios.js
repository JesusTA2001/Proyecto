const { pool } = require('./backend/config/db');

async function verificarCatalogo() {
  try {
    console.log('🔍 Verificando catálogo de estudios...\n');
    
    console.log('✅ Conectado a la base de datos\n');
    
    // Verificar si la tabla existe
    const [tables] = await pool.query(`
      SHOW TABLES LIKE 'CatalogoEstudios'
    `);
    
    if (tables.length === 0) {
      console.log('❌ La tabla CatalogoEstudios NO existe\n');
      return;
    }
    
    console.log('✅ La tabla CatalogoEstudios existe\n');
    
    // Obtener todos los registros
    const [registros] = await pool.query(`
      SELECT * FROM CatalogoEstudios ORDER BY id_Estudio
    `);
    
    console.log(`📊 Registros encontrados: ${registros.length}\n`);
    
    if (registros.length === 0) {
      console.log('⚠️  La tabla CatalogoEstudios está VACÍA\n');
      console.log('Insertando datos iniciales...\n');
      
      // Insertar datos
      const niveles = [
        'Licenciatura',
        'Maestría',
        'Doctorado',
        'Técnico Superior',
        'Especialidad',
        'Preparatoria',
        'Secundaria'
      ];
      
      for (const nivel of niveles) {
        await pool.query(
          'INSERT INTO CatalogoEstudios (nivelEstudio) VALUES (?) ON DUPLICATE KEY UPDATE nivelEstudio = VALUES(nivelEstudio)',
          [nivel]
        );
        console.log(`✅ Insertado: ${nivel}`);
      }
      
      console.log('\n✅ Datos insertados correctamente\n');
      
      // Volver a consultar
      const [nuevosRegistros] = await pool.query(`
        SELECT * FROM CatalogoEstudios ORDER BY id_Estudio
      `);
      
      console.log('📊 Catálogo actualizado:\n');
      console.table(nuevosRegistros);
    } else {
      console.log('📋 Catálogo de estudios:\n');
      console.table(registros);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
  } finally {
    process.exit(0);
  }
}

verificarCatalogo();
