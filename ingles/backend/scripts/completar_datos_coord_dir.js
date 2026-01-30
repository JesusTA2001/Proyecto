const { pool } = require('../config/db');

async function completarDatosCoordinadoresDirectivos() {
  let connection;
  
  try {
    console.log('🔧 COMPLETANDO DATOS PERSONALES PARA COORDINADORES Y DIRECTIVOS\n');
    console.log('='.repeat(80));

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Verificar estado actual
    console.log('\n📊 ESTADO ACTUAL:');
    
    const [coordSinDatos] = await connection.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.id_relacion,
        c.id_Coordinador,
        c.id_empleado,
        e.id_dp
      FROM usuarios u
      INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
      INNER JOIN empleado e ON c.id_empleado = e.id_empleado
      LEFT JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'COORDINADOR'
    `);
    
    console.log(`\nCoordinadores encontrados: ${coordSinDatos.length}`);
    
    const [dirSinDatos] = await connection.query(`
      SELECT 
        u.id_usuario,
        u.usuario,
        u.id_relacion,
        d.id_Directivo,
        d.id_empleado,
        e.id_dp
      FROM usuarios u
      INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
      INNER JOIN empleado e ON d.id_empleado = e.id_empleado
      LEFT JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'DIRECTIVO'
    `);
    
    console.log(`Directivos encontrados: ${dirSinDatos.length}`);

    // 2. Verificar si ya tienen datos personales
    console.log('\n🔍 VERIFICANDO DATOS PERSONALES EXISTENTES:');
    
    const coordinadoresConDatos = coordSinDatos.filter(c => c.id_dp !== null);
    const coordinadoresSinDatos = coordSinDatos.filter(c => c.id_dp === null);
    
    const directivosConDatos = dirSinDatos.filter(d => d.id_dp !== null);
    const directivosSinDatos = dirSinDatos.filter(d => d.id_dp === null);
    
    console.log(`\n✅ Coordinadores con datos: ${coordinadoresConDatos.length}`);
    console.log(`❌ Coordinadores sin datos: ${coordinadoresSinDatos.length}`);
    console.log(`✅ Directivos con datos: ${directivosConDatos.length}`);
    console.log(`❌ Directivos sin datos: ${directivosSinDatos.length}`);

    // 3. Crear datos personales para coordinadores sin datos
    console.log('\n📝 CREANDO DATOS PERSONALES PARA COORDINADORES:');
    
    for (let i = 0; i < coordinadoresSinDatos.length; i++) {
      const coord = coordinadoresSinDatos[i];
      const numero = coord.id_Coordinador;
      
      // Insertar datos personales
      const [dpResult] = await connection.query(`
        INSERT INTO datospersonales (
          apellidoPaterno, apellidoMaterno, nombre, email, 
          genero, CURP, telefono, direccion
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?
        )
      `, [
        `Apellido_Coord${numero}`,
        `Materno_Coord${numero}`,
        `Coordinador ${numero}`,
        `coordinador${numero}@institucion.edu.mx`,
        'Masculino',
        `COORD${String(numero).padStart(10, '0')}XXX`,
        `(555) 000-${String(numero).padStart(4, '0')}`,
        `Oficina Coordinación ${numero}, Edificio Administrativo`
      ]);
      
      const newDpId = dpResult.insertId;
      
      // Actualizar empleado con el id_dp
      await connection.query(`
        UPDATE empleado 
        SET id_dp = ? 
        WHERE id_empleado = ?
      `, [newDpId, coord.id_empleado]);
      
      console.log(`   ✅ coord${numero} - Datos personales creados (id_dp: ${newDpId})`);
    }

    // 4. Crear datos personales para directivos sin datos
    console.log('\n📝 CREANDO DATOS PERSONALES PARA DIRECTIVOS:');
    
    for (let i = 0; i < directivosSinDatos.length; i++) {
      const dir = directivosSinDatos[i];
      const numero = dir.id_Directivo;
      
      // Insertar datos personales
      const [dpResult] = await connection.query(`
        INSERT INTO datospersonales (
          apellidoPaterno, apellidoMaterno, nombre, email, 
          genero, CURP, telefono, direccion
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?
        )
      `, [
        `Apellido_Dir${numero}`,
        `Materno_Dir${numero}`,
        `Director ${numero}`,
        `director${numero}@institucion.edu.mx`,
        'Masculino',
        `DIRECT${String(numero).padStart(10, '0')}XXX`,
        `(555) 100-${String(numero).padStart(4, '0')}`,
        `Oficina Dirección ${numero}, Edificio Administrativo Principal`
      ]);
      
      const newDpId = dpResult.insertId;
      
      // Actualizar empleado con el id_dp
      await connection.query(`
        UPDATE empleado 
        SET id_dp = ? 
        WHERE id_empleado = ?
      `, [newDpId, dir.id_empleado]);
      
      console.log(`   ✅ dir${numero} - Datos personales creados (id_dp: ${newDpId})`);
    }

    // 5. Verificar resultado final
    console.log('\n' + '='.repeat(80));
    console.log('📊 VERIFICACIÓN FINAL:\n');
    
    console.log('👥 COORDINADORES CON DATOS COMPLETOS:');
    const [coordFinal] = await connection.query(`
      SELECT 
        u.usuario,
        dp.nombre,
        dp.apellidoPaterno,
        dp.apellidoMaterno,
        dp.email,
        dp.telefono
      FROM usuarios u
      INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
      INNER JOIN empleado e ON c.id_empleado = e.id_empleado
      INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'COORDINADOR'
      ORDER BY u.usuario
    `);
    console.table(coordFinal);
    
    console.log('\n👔 DIRECTIVOS CON DATOS COMPLETOS:');
    const [dirFinal] = await connection.query(`
      SELECT 
        u.usuario,
        dp.nombre,
        dp.apellidoPaterno,
        dp.apellidoMaterno,
        dp.email,
        dp.telefono
      FROM usuarios u
      INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
      INNER JOIN empleado e ON d.id_empleado = e.id_empleado
      INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
      WHERE u.rol = 'DIRECTIVO'
      ORDER BY u.usuario
    `);
    console.table(dirFinal);

    // Confirmar transacción
    await connection.commit();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE');
    console.log('\n📌 RESUMEN:');
    console.log(`   - Coordinadores procesados: ${coordinadoresSinDatos.length}`);
    console.log(`   - Directivos procesados: ${directivosSinDatos.length}`);
    console.log(`   - Total: ${coordFinal.length + dirFinal.length} usuarios con datos completos`);

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

completarDatosCoordinadoresDirectivos();
