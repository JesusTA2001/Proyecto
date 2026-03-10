const { pool } = require('./backend/config/db');

async function migrarSistemaEstudios() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos Azure...\n');
    connection = await pool.getConnection();
    
    // PASO 1: Actualizar CatalogoEstudios - Renombrar columna Nombre a nivelEstudio
    console.log('📝 PASO 1: Actualizando tabla CatalogoEstudios...');
    
    try {
      await connection.query(`
        ALTER TABLE CatalogoEstudios 
        CHANGE COLUMN Nombre nivelEstudio VARCHAR(50) UNIQUE NOT NULL
      `);
      console.log('✅ Columna renombrada: Nombre → nivelEstudio\n');
    } catch (error) {
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        console.log('ℹ️  La columna ya se llama nivelEstudio\n');
      } else {
        throw error;
      }
    }
    
    // Agregar niveles faltantes
    console.log('📝 PASO 2: Verificando niveles de estudio...');
    const nivelesNuevos = [
      'Especialidad',
      'Técnico Superior'
    ];
    
    for (const nivel of nivelesNuevos) {
      try {
        await connection.query(`
          INSERT INTO CatalogoEstudios (nivelEstudio) VALUES (?)
        `, [nivel]);
        console.log(`  ✅ Agregado: ${nivel}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  ℹ️  Ya existe: ${nivel}`);
        } else {
          console.log(`  ⚠️  Error con ${nivel}:`, error.message);
        }
      }
    }
    console.log('');
    
    // PASO 3: Actualizar tabla Preparacion
    console.log('📝 PASO 3: Actualizando tabla Preparacion...');
    
    // Agregar columna titulo
    try {
      await connection.query(`
        ALTER TABLE Preparacion 
        ADD COLUMN titulo VARCHAR(200) NOT NULL DEFAULT 'Sin especificar'
      `);
      console.log('  ✅ Columna agregada: titulo');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('  ℹ️  Columna titulo ya existe');
      } else {
        console.log('  ⚠️  ', error.message);
      }
    }
    
    // Agregar columna institucion
    try {
      await connection.query(`
        ALTER TABLE Preparacion 
        ADD COLUMN institucion VARCHAR(200) NULL
      `);
      console.log('  ✅ Columna agregada: institucion');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('  ℹ️  Columna institucion ya existe');
      } else {
        console.log('  ⚠️  ', error.message);
      }
    }
    
    // Agregar columna año_obtencion
    try {
      await connection.query(`
        ALTER TABLE Preparacion 
        ADD COLUMN año_obtencion YEAR NULL
      `);
      console.log('  ✅ Columna agregada: año_obtencion');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('  ℹ️  Columna año_obtencion ya existe');
      } else {
        console.log('  ⚠️  ', error.message);
      }
    }
    
    // Agregar columna created_at
    try {
      await connection.query(`
        ALTER TABLE Preparacion 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('  ✅ Columna agregada: created_at');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('  ℹ️  Columna created_at ya existe');
      } else {
        console.log('  ⚠️  ', error.message);
      }
    }
    
    // Hacer id_Estudio NOT NULL si tiene datos
    try {
      await connection.query(`
        ALTER TABLE Preparacion 
        MODIFY COLUMN id_Estudio INT NOT NULL
      `);
      console.log('  ✅ Columna id_Estudio actualizada a NOT NULL');
    } catch (error) {
      console.log('  ⚠️  No se pudo cambiar id_Estudio a NOT NULL:', error.message);
    }
    
    // Eliminar columna nivel_Estudio si existe (redundante)
    try {
      await connection.query(`
        ALTER TABLE Preparacion 
        DROP COLUMN nivel_Estudio
      `);
      console.log('  ✅ Columna eliminada: nivel_Estudio (redundante)');
    } catch (error) {
      if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log('  ℹ️  Columna nivel_Estudio ya fue eliminada');
      } else {
        console.log('  ⚠️  ', error.message);
      }
    }
    
    // Agregar índices
    try {
      await connection.query(`
        ALTER TABLE Preparacion 
        ADD INDEX idx_profesor (id_Profesor)
      `);
      console.log('  ✅ Índice agregado: idx_profesor');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('  ℹ️  Índice idx_profesor ya existe');
      }
    }
    
    try {
      await connection.query(`
        ALTER TABLE Preparacion 
        ADD INDEX idx_estudio (id_Estudio)
      `);
      console.log('  ✅ Índice agregado: idx_estudio');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('  ℹ️  Índice idx_estudio ya existe');
      }
    }
    
    console.log('');
    
    // PASO 4: Marcar nivelEstudio en Profesor como obsoleto
    console.log('📝 PASO 4: Actualizando tabla Profesor...');
    try {
      await connection.query(`
        ALTER TABLE Profesor 
        MODIFY COLUMN nivelEstudio VARCHAR(50) COMMENT 'OBSOLETO - Usar tabla Preparacion'
      `);
      console.log('✅ Campo nivelEstudio marcado como obsoleto\n');
    } catch (error) {
      console.log('⚠️  ', error.message, '\n');
    }
    
    // VERIFICACIÓN FINAL
    console.log('='.repeat(70));
    console.log('📊 VERIFICACIÓN FINAL\n');
    
    console.log('📚 CatalogoEstudios:');
    const [catalogoEstudios] = await connection.query(`
      SELECT id_Estudio, nivelEstudio 
      FROM CatalogoEstudios 
      ORDER BY id_Estudio
    `);
    console.table(catalogoEstudios);
    
    console.log('\n📋 Estructura de Preparacion:');
    const [estructura] = await connection.query('DESCRIBE Preparacion');
    console.table(estructura);
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Migración completada exitosamente\n');
    
    console.log('📝 ESTRUCTURA FINAL:');
    console.log('   • CatalogoEstudios: 6 niveles disponibles');
    console.log('   • Preparacion: titulo, institucion, año_obtencion agregados');
    console.log('   • Profesor.nivelEstudio: marcado como obsoleto\n');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error(error);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

migrarSistemaEstudios();
