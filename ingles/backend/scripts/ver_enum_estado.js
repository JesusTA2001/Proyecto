const { pool } = require('../config/db');

async function verEnumEstado() {
  try {
    console.log('🔍 Verificando columna estado en EstudianteGrupo...\n');
    
    const [rows] = await pool.query('DESCRIBE EstudianteGrupo');
    const estadoCol = rows.find(r => r.Field === 'estado');
    
    console.log('📋 Columna estado:');
    console.log(JSON.stringify(estadoCol, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verEnumEstado();
