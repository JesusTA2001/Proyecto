// Script para insertar datos de prueba en la BD Azure
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysqlingles.mysql.database.azure.com',
  user: 'admin_ingles',
  password: 'Gui11ermo1',
  database: 'proyectoIngles',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

async function insertTestData() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    console.log('✓ Conectado a la BD Azure');
    
    // PASO 0: Verificar y agregar columnas si no existen
    try {
      await connection.query(`ALTER TABLE Periodo ADD COLUMN fecha_inicio DATE DEFAULT NULL`);
      console.log('✓ Columna fecha_inicio agregada a Periodo');
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
      console.log('✓ Columna fecha_inicio ya existe');
    }
    
    try {
      await connection.query(`ALTER TABLE Periodo ADD COLUMN fecha_fin DATE DEFAULT NULL`);
      console.log('✓ Columna fecha_fin agregada a Periodo');
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
      console.log('✓ Columna fecha_fin ya existe');
    }
    
    try {
      await connection.query(`ALTER TABLE Periodo ADD COLUMN estado VARCHAR(50) DEFAULT 'Activo'`);
      console.log('✓ Columna estado agregada a Periodo');
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
      console.log('✓ Columna estado ya existe');
    }
    
    // PASO 1: Insertar período
    const [periodoResult] = await connection.query(
      'INSERT INTO Periodo (descripcion, año, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
      ['PERIODO TEST - ELIMINAR', 2026, '2025-01-01', '2025-12-31', 'Finalizado']
    );
    const periodo_id = periodoResult.insertId;
    console.log(`✓ Período insertado con ID: ${periodo_id}`);
    
    // PASO 2: Insertar grupo
    const [grupoResult] = await connection.query(
      'INSERT INTO Grupo (grupo, id_Periodo, id_Profesor, id_Nivel, ubicacion, id_cHorario) VALUES (?, ?, ?, ?, ?, ?)',
      ['TEST-GRUPO-HIST', periodo_id, 1, 1, 'Aula Test', 1]
    );
    const grupo_id = grupoResult.insertId;
    console.log(`✓ Grupo insertado con ID: ${grupo_id}`);
    
    // PASO 3: Insertar estudiantes en el grupo
    await connection.query(
      'INSERT INTO EstudianteGrupo (nControl, id_Grupo, estado) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
      ['TEST001', grupo_id, 'concluido', 'TEST002', grupo_id, 'concluido', 'TEST003', grupo_id, 'concluido']
    );
    console.log('✓ 3 estudiantes insertados en el grupo');
    
    // PASO 4: Insertar calificaciones
    await connection.query(
      'INSERT INTO Calificaciones (nControl, parcial1, parcial2, parcial3, final, id_nivel, id_Periodo, id_Grupo) VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)',
      ['TEST001', 85, 90, 88, 87.67, 1, periodo_id, grupo_id,
       'TEST002', 75, 78, 80, 77.67, 1, periodo_id, grupo_id,
       'TEST003', 92, 95, 93, 93.33, 1, periodo_id, grupo_id]
    );
    console.log('✓ Calificaciones insertadas');
    
    console.log('\n✅ Datos de prueba insertados exitosamente');
    console.log(`\n📌 IDs de prueba para limpiar después:`);
    console.log(`   Periodo ID: ${periodo_id}`);
    console.log(`   Grupo ID: ${grupo_id}`);
    console.log(`\n🔍 Verifica en el navegador: Administrador → Estudiantes → Historial de Grupos`);
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.release();
    process.exit(1);
  }
}

insertTestData();
