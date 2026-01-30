const { pool } = require('./config/db');

async function verificarEstructura() {
  try {
    console.log('Verificando estructura de la tabla Grupo...\n');

    // Obtener la estructura de la tabla
    const [estructura] = await pool.query(`DESCRIBE Grupo`);
    
    console.log('=== ESTRUCTURA DE LA TABLA GRUPO ===');
    console.table(estructura);

    // Ver valores únicos actuales de estado
    const [estadosActuales] = await pool.query(`
      SELECT DISTINCT estado FROM Grupo
    `);
    
    console.log('\n=== VALORES ACTUALES DE ESTADO ===');
    console.table(estadosActuales);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verificarEstructura();
