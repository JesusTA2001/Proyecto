const mysql = require('mysql2/promise');
require('dotenv').config();

// ============================================
// CONEXIÓN LOCAL (COMENTADA)
// ============================================
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'root',
//   database: process.env.DB_NAME || 'proyectoingles',
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// ============================================
// CONEXIÓN AZURE (ACTIVA)
// ============================================
// Variables de entorno usadas por esta conexión:
// - DB_HOST: host del servidor MySQL de Azure
// - DB_USER: usuario de acceso a la base de datos
// - DB_PASSWORD: contraseña del usuario
// - DB_NAME: nombre de la base de datos
// - DB_PORT: puerto de conexión (opcional, por defecto 3306)
// mysqlingles.mysql.database.azure.com port 3306

// ============================================
// CONEXIÓN AIVEN (DISPONIBLE - COMENTADA)
// ============================================
// Variables de entorno sugeridas para Aiven:
// - AIVEN_DB_HOST
// - AIVEN_DB_USER
// - AIVEN_DB_PASSWORD
// - AIVEN_DB_NAME
// - AIVEN_DB_PORT
// - AIVEN_SSL_MODE (opcional: REQUIRED | DISABLED)

// Selector de proveedor: azure | aiven
// Para esta prueba se fuerza Azure.
const dbProvider = 'azure';

// Configuración Azure (se mantiene para referencia)
const azureConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
};

// CONFIGURACIÓN AIVEN COMENTADA - Para activar cambiar dbProvider a 'aiven'
// const useAivenSsl = (process.env.AIVEN_SSL_MODE || 'REQUIRED').toUpperCase() !== 'DISABLED';
// const aivenConfig = {
//   // Datos de prueba compartidos por el usuario
//   host: process.env.AIVEN_DB_HOST || 'mysql-5e061d7-accitesz-f16a.d.aivencloud.com',
//   user: process.env.AIVEN_DB_USER || 'avnadmin',
//   password: process.env.AIVEN_DB_PASSWORD || 'AIVEN_DB_PASSWORD',
//   database: process.env.AIVEN_DB_NAME || 'defaultdb',
//   port: parseInt(process.env.AIVEN_DB_PORT, 10) || 17463,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ssl: {
//     rejectUnauthorized: false
//   }
// };

const selectedConfig = azureConfig; // Para usar Aiven, cambiar a: aivenConfig
const pool = mysql.createPool(selectedConfig);

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a MySQL');
    console.log(`📊 Base de datos: ${selectedConfig.database}`);
    console.log(`🔌 Host: ${selectedConfig.host}:${selectedConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };
