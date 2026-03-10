const { pool } = require('./backend/config/db');

async function verificarEstructuraEstudios() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos Azure...\n');
    connection = await pool.getConnection();
    
    // Verificar si existe la tabla CatalogoEstudios
    console.log('📝 Verificando tabla CatalogoEstudios...\n');
    
    try {
      const [tables] = await connection.query(`
        SHOW TABLES LIKE 'CatalogoEstudios'
      `);
      
      if (tables.length === 0) {
        console.log('⚠️  La tabla CatalogoEstudios NO existe\n');
      } else {
        console.log('✅ La tabla CatalogoEstudios existe\n');
        
        console.log('📋 Estructura actual:');
        const [estructura] = await connection.query('DESCRIBE CatalogoEstudios');
        console.table(estructura);
        
        console.log('\n📊 Datos actuales:');
        const [datos] = await connection.query('SELECT * FROM CatalogoEstudios');
        if (datos.length > 0) {
          console.table(datos);
        } else {
          console.log('   (Tabla vacía)\n');
        }
      }
    } catch (error) {
      console.log('⚠️  Error al verificar:', error.message, '\n');
    }
    
    // Verificar tabla Preparacion
    console.log('\n' + '='.repeat(70));
    console.log('📝 Verificando tabla Preparacion...\n');
    
    try {
      const [tables] = await connection.query(`
        SHOW TABLES LIKE 'Preparacion'
      `);
      
      if (tables.length === 0) {
        console.log('⚠️  La tabla Preparacion NO existe\n');
      } else {
        console.log('✅ La tabla Preparacion existe\n');
        
        console.log('📋 Estructura actual:');
        const [estructura] = await connection.query('DESCRIBE Preparacion');
        console.table(estructura);
        
        console.log('\n📊 Datos actuales:');
        const [datos] = await connection.query('SELECT * FROM Preparacion');
        if (datos.length > 0) {
          console.table(datos);
        } else {
          console.log('   (Tabla vacía)\n');
        }
      }
    } catch (error) {
      console.log('⚠️  Error al verificar:', error.message, '\n');
    }
    
    // Verificar tabla Profesor
    console.log('\n' + '='.repeat(70));
    console.log('📝 Verificando columna nivelEstudio en Profesor...\n');
    
    try {
      const [estructura] = await connection.query('DESCRIBE Profesor');
      const nivelEstudio = estructura.find(col => col.Field === 'nivelEstudio');
      
      if (nivelEstudio) {
        console.log('✅ Columna nivelEstudio existe en Profesor');
        console.log('   Tipo:', nivelEstudio.Type);
        console.log('   Null:', nivelEstudio.Null);
        console.log('   Default:', nivelEstudio.Default);
      } else {
        console.log('⚠️  Columna nivelEstudio NO existe en Profesor');
      }
    } catch (error) {
      console.log('⚠️  Error al verificar:', error.message);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Verificación completada\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

verificarEstructuraEstudios();
