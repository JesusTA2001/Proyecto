const { pool } = require('./backend/config/db');

async function actualizarSistemaEstudios() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos Azure...\n');
    connection = await pool.getConnection();
    
    // PASO 1: Crear/Actualizar tabla CatalogoEstudios
    console.log('📝 PASO 1: Configurando tabla CatalogoEstudios...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS CatalogoEstudios (
        id_Estudio INT AUTO_INCREMENT PRIMARY KEY,
        nivelEstudio VARCHAR(50) UNIQUE NOT NULL
      )
    `);
    console.log('✅ Tabla CatalogoEstudios verificada\n');
    
    // Insertar niveles de estudio
    console.log('📝 PASO 2: Insertando niveles de estudio...');
    const nivelesEstudio = [
      'Licenciatura',
      'Maestría',
      'Doctorado',
      'Diplomado',
      'Especialidad',
      'Técnico Superior'
    ];
    
    for (const nivel of nivelesEstudio) {
      await connection.query(`
        INSERT INTO CatalogoEstudios (nivelEstudio) VALUES (?)
        ON DUPLICATE KEY UPDATE nivelEstudio = VALUES(nivelEstudio)
      `, [nivel]);
      console.log(`  ✅ ${nivel}`);
    }
    console.log('');
    
    // PASO 3: Recrear tabla Preparacion
    console.log('📝 PASO 3: Actualizando tabla Preparacion...');
    
    // Eliminar tabla anterior si existe
    await connection.query('DROP TABLE IF EXISTS Preparacion');
    console.log('  ℹ️  Tabla anterior eliminada');
    
    // Crear nueva estructura
    await connection.query(`
      CREATE TABLE Preparacion (
        id_prep INT AUTO_INCREMENT PRIMARY KEY,
        id_Profesor INT NOT NULL,
        id_Estudio INT NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        institucion VARCHAR(200),
        año_obtencion YEAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_Profesor) REFERENCES Profesor(id_Profesor) ON DELETE CASCADE,
        FOREIGN KEY (id_Estudio) REFERENCES CatalogoEstudios(id_Estudio),
        INDEX idx_profesor (id_Profesor),
        INDEX idx_estudio (id_Estudio)
      )
    `);
    console.log('✅ Tabla Preparacion creada con nueva estructura\n');
    
    // PASO 4: Marcar columna nivelEstudio como obsoleta en Profesor
    console.log('📝 PASO 4: Actualizando tabla Profesor...');
    try {
      await connection.query(`
        ALTER TABLE Profesor 
        MODIFY COLUMN nivelEstudio VARCHAR(50) COMMENT 'OBSOLETO - Usar tabla Preparacion'
      `);
      console.log('✅ Columna nivelEstudio marcada como obsoleta\n');
    } catch (error) {
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        console.log('ℹ️  Columna nivelEstudio no existe, continuando...\n');
      } else {
        console.log('⚠️  ', error.message, '\n');
      }
    }
    
    // VERIFICACIÓN
    console.log('='.repeat(70));
    console.log('📊 VERIFICACIÓN - CATÁLOGO DE ESTUDIOS\n');
    
    const [catalogoEstudios] = await connection.query(`
      SELECT id_Estudio, nivelEstudio 
      FROM CatalogoEstudios 
      ORDER BY id_Estudio
    `);
    
    console.table(catalogoEstudios);
    
    console.log('\n' + '='.repeat(70));
    console.log('📋 ESTRUCTURA DE PREPARACION\n');
    
    const [estructura] = await connection.query('DESCRIBE Preparacion');
    console.table(estructura);
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Sistema de estudios actualizado exitosamente\n');
    
    console.log('📝 SIGUIENTE PASO:');
    console.log('   Al crear/editar profesores, ahora puedes agregar múltiples estudios');
    console.log('   con campos: nivel, título, institución y año\n');
    
  } catch (error) {
    console.error('❌ Error al actualizar sistema:', error.message);
    console.error(error);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

actualizarSistemaEstudios();
