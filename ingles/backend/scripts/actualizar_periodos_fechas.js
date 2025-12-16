const { pool } = require('../config/db');

async function actualizarPeriodos() {
  try {
    console.log('Actualizando periodos con fechas de inicio y fin...');
    
    // Obtener todos los periodos
    const [periodos] = await pool.query('SELECT * FROM Periodo');
    
    for (const periodo of periodos) {
      let fechaInicio, fechaFin;
      
      // Determinar fechas según la descripción del periodo
      const descripcion = periodo.descripcion.toLowerCase();
      const año = periodo.año;
      
      // Formato: 2025-1 (primer semestre: feb-jun), 2025-2 (segundo semestre: ago-ene)
      if (descripcion.endsWith('-1') || descripcion.includes('1')) {
        // Primer semestre: Febrero - Junio
        fechaInicio = `${año}-02-01`;
        fechaFin = `${año}-06-30`;
      } else if (descripcion.endsWith('-2') || descripcion.includes('2')) {
        // Segundo semestre: Agosto - Enero (del año siguiente)
        fechaInicio = `${año}-08-01`;
        fechaFin = `${parseInt(año) + 1}-01-30`;
      } else if (descripcion.includes('ene-jun') || descripcion.includes('febrero-junio')) {
        // Semestre Febrero - Junio
        fechaInicio = `${año}-02-01`;
        fechaFin = `${año}-06-30`;
      } else if (descripcion.includes('ago-ene') || descripcion.includes('agosto-enero')) {
        // Semestre Agosto - Enero (del año siguiente)
        fechaInicio = `${año}-08-01`;
        fechaFin = `${parseInt(año) + 1}-01-30`;
      } else {
        console.log(`⚠️  Periodo ${periodo.descripcion} no tiene formato reconocido, se omite`);
        continue;
      }
      
      await pool.query(`
        UPDATE Periodo 
        SET fecha_inicio = ?, fecha_fin = ?
        WHERE id_Periodo = ?
      `, [fechaInicio, fechaFin, periodo.id_Periodo]);
      
      console.log(`✅ Periodo ${periodo.descripcion}: ${fechaInicio} a ${fechaFin}`);
    }
    
    console.log('✅ Todos los periodos actualizados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

actualizarPeriodos();
