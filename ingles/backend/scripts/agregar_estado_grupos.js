const { pool } = require('../config/db');

async function agregarCamposEstado() {
  try {
    console.log('Agregando campos para estado de grupos...');
    
    // Agregar campo estado a Grupo
    await pool.query(`
      ALTER TABLE Grupo 
      ADD COLUMN estado ENUM('activo', 'inactivo') DEFAULT 'activo'
    `);
    console.log('✅ Campo estado agregado a Grupo');
    
    // Agregar campos de fecha a Periodo
    await pool.query(`
      ALTER TABLE Periodo 
      ADD COLUMN fecha_inicio DATE
    `);
    console.log('✅ Campo fecha_inicio agregado a Periodo');
    
    await pool.query(`
      ALTER TABLE Periodo 
      ADD COLUMN fecha_fin DATE
    `);
    console.log('✅ Campo fecha_fin agregado a Periodo');
    
    console.log('✅ Todos los campos agregados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

agregarCamposEstado();
