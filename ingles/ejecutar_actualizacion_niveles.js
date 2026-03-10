const { pool } = require('./backend/config/db');

async function ejecutarActualizacionNiveles() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos Azure...\n');
    connection = await pool.getConnection();
    
    // PASO 1: Agregar columna campus
    console.log('📝 PASO 1: Agregando columna campus a la tabla Nivel...');
    try {
      await connection.query(`
        ALTER TABLE Nivel 
        ADD COLUMN campus ENUM('Tecnologico','Centro de Idiomas') DEFAULT 'Tecnologico'
      `);
      console.log('✅ Columna campus agregada exitosamente\n');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  La columna campus ya existe, continuando...\n');
      } else {
        throw error;
      }
    }
    
    // PASO 2: Actualizar niveles existentes del Tecnológico
    console.log('📝 PASO 2: Actualizando niveles del Tecnológico...');
    for (let i = 0; i <= 6; i++) {
      await connection.query(
        `UPDATE Nivel SET campus = 'Tecnologico' WHERE id_Nivel = ?`,
        [i]
      );
    }
    console.log('✅ 7 niveles del Tecnológico actualizados (Intro + Nivel 1-6)\n');
    
    // PASO 3: Insertar niveles del Centro de Idiomas
    console.log('📝 PASO 3: Insertando niveles del Centro de Idiomas...');
    
    const nivelesCI = [
      { id: 7, nombre: 'Kids 1' },
      { id: 8, nombre: 'Kids 2' },
      { id: 9, nombre: 'Kids 3' },
      { id: 10, nombre: 'Kids 4' },
      { id: 11, nombre: 'Teens 1' },
      { id: 12, nombre: 'Teens 2' },
      { id: 13, nombre: 'Teens 3' },
      { id: 14, nombre: 'Teens 4' },
      { id: 15, nombre: 'Conversación 1' },
      { id: 16, nombre: 'Conversación 2' },
      { id: 17, nombre: 'Diplomado 1' },
      { id: 18, nombre: 'Diplomado 2' }
    ];
    
    for (const nivel of nivelesCI) {
      await connection.query(`
        INSERT INTO Nivel (id_Nivel, nivel, campus) 
        VALUES (?, ?, 'Centro de Idiomas')
        ON DUPLICATE KEY UPDATE nivel = ?, campus = 'Centro de Idiomas'
      `, [nivel.id, nivel.nombre, nivel.nombre]);
      console.log(`  ✅ ${nivel.nombre}`);
    }
    console.log(`\n✅ ${nivelesCI.length} niveles del Centro de Idiomas insertados\n`);
    
    // PASO 4: Verificar todos los niveles
    console.log('='.repeat(70));
    console.log('📊 VERIFICACIÓN FINAL - TODOS LOS NIVELES\n');
    
    const [niveles] = await connection.query(`
      SELECT id_Nivel, nivel, campus 
      FROM Nivel 
      ORDER BY 
        CASE campus 
          WHEN 'Tecnologico' THEN 1 
          WHEN 'Centro de Idiomas' THEN 2 
        END,
        id_Nivel
    `);
    
    console.table(niveles);
    
    console.log('\n' + '='.repeat(70));
    console.log('📈 RESUMEN POR CAMPUS\n');
    
    const [resumen] = await connection.query(`
      SELECT 
        campus, 
        COUNT(*) AS total_niveles
      FROM Nivel 
      GROUP BY campus
      ORDER BY 
        CASE campus 
          WHEN 'Tecnologico' THEN 1 
          WHEN 'Centro de Idiomas' THEN 2 
        END
    `);
    
    resumen.forEach(r => {
      console.log(`${r.campus}: ${r.total_niveles} niveles`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Actualización completada exitosamente\n');
    
  } catch (error) {
    console.error('❌ Error al ejecutar actualización:', error.message);
    console.error(error);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

ejecutarActualizacionNiveles();
