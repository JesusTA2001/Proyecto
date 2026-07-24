const mysql = require('mysql2/promise');
require('dotenv').config();

// ============================================
// CONFIGURACIÓN DE CONEXIÓN UNIVERSAL
// ============================================
// Lee las variables genéricas de entorno sin importar el proveedor (Aiven, Azure, Local)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'proyectoingles',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Si el proveedor exige SSL (como Aiven o Azure), se agrega a la configuración
const sslValue = String(process.env.DB_SSL).toLowerCase().trim();
if (sslValue === 'true' || sslValue === '1' || (dbConfig.host && dbConfig.host.includes('aivencloud.com'))) {
  dbConfig.ssl = {
    rejectUnauthorized: false // false es necesario para Aiven si no se provee el CA Certificate
  };
}

const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a MySQL');
    console.log(`📊 Base de datos: ${dbConfig.database}`);
    console.log(`🔌 Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };
