const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configuración de conexión
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'proyectoingles',
  port: 3306
};

async function crearUsuariosCompleto() {
  let connection;
  
  try {
    console.log('\n🔗 Conectando a la base de datos...\n');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión exitosa\n');

    // ================================
    // 1. LIMPIAR TABLA USUARIOS
    // ================================
    console.log('🗑️  Limpiando tabla Usuarios...');
    await connection.query('DELETE FROM Usuarios');
    console.log('✅ Tabla Usuarios limpiada\n');

    let totalCreados = 0;

    // ================================
    // 2. CREAR USUARIOS PARA ESTUDIANTES
    // ================================
    console.log('👨‍🎓 Creando usuarios para ESTUDIANTES...');
    const [estudiantes] = await connection.query(`
      SELECT e.nControl, dp.nombre, dp.apellidoPaterno 
      FROM Estudiante e 
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY e.nControl
    `);
    
    console.log(`   📚 Encontrados ${estudiantes.length} estudiantes`);
    
    for (const est of estudiantes) {
      const usuario = est.nControl.toString(); // Usuario = número de control
      const contraseña = `${est.nombre.substring(0, 3).toLowerCase()}${new Date().getFullYear()}`; // Ej: "Jua2025"
      const contraseñaHash = await bcrypt.hash(contraseña, 10);
      
      await connection.query(
        'INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)',
        [usuario, contraseñaHash, 'ESTUDIANTE', est.nControl]
      );
      
      console.log(`   ✓ ${usuario} / ${contraseña} (${est.nombre} ${est.apellidoPaterno})`);
      totalCreados++;
    }
    console.log(`\n✅ ${estudiantes.length} estudiantes creados\n`);

    // ================================
    // 3. CREAR USUARIOS PARA PROFESORES
    // ================================
    console.log('👨‍🏫 Creando usuarios para PROFESORES...');
    const [profesores] = await connection.query(`
      SELECT p.id_Profesor, dp.nombre, dp.apellidoPaterno 
      FROM Profesor p 
      JOIN Empleado e ON p.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY p.id_Profesor
    `);
    
    console.log(`   📚 Encontrados ${profesores.length} profesores`);
    
    for (const prof of profesores) {
      const usuario = `prof${prof.id_Profesor}`; // Usuario = prof + id
      const contraseña = `${prof.nombre.substring(0, 3).toLowerCase()}${prof.apellidoPaterno.substring(0, 3).toLowerCase()}`; // Ej: "siltej" para Silvia Tejeda
      const contraseñaHash = await bcrypt.hash(contraseña, 10);
      
      await connection.query(
        'INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)',
        [usuario, contraseñaHash, 'PROFESOR', prof.id_Profesor]
      );
      
      console.log(`   ✓ ${usuario} / ${contraseña} (${prof.nombre} ${prof.apellidoPaterno})`);
      totalCreados++;
    }
    console.log(`\n✅ ${profesores.length} profesores creados\n`);

    // ================================
    // 4. CREAR USUARIOS PARA ADMINISTRADORES
    // ================================
    console.log('👨‍💼 Creando usuarios para ADMINISTRADORES...');
    const [administradores] = await connection.query(`
      SELECT a.id_Administrador, dp.nombre, dp.apellidoPaterno 
      FROM Administrador a 
      JOIN Empleado e ON a.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY a.id_Administrador
    `);
    
    console.log(`   📚 Encontrados ${administradores.length} administradores`);
    
    for (const admin of administradores) {
      const usuario = `admin${admin.id_Administrador}`; // Usuario = admin + id
      const contraseña = `${admin.nombre.substring(0, 3).toLowerCase()}${admin.apellidoPaterno.substring(0, 3).toLowerCase()}`; // Ej: "margar"
      const contraseñaHash = await bcrypt.hash(contraseña, 10);
      
      await connection.query(
        'INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)',
        [usuario, contraseñaHash, 'ADMINISTRADOR', admin.id_Administrador]
      );
      
      console.log(`   ✓ ${usuario} / ${contraseña} (${admin.nombre} ${admin.apellidoPaterno})`);
      totalCreados++;
    }
    console.log(`\n✅ ${administradores.length} administradores creados\n`);

    // ================================
    // 5. CREAR USUARIOS PARA COORDINADORES
    // ================================
    console.log('👔 Creando usuarios para COORDINADORES...');
    const [coordinadores] = await connection.query(`
      SELECT c.id_Coordinador, dp.nombre, dp.apellidoPaterno 
      FROM Coordinador c 
      JOIN Empleado e ON c.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY c.id_Coordinador
    `);
    
    console.log(`   📚 Encontrados ${coordinadores.length} coordinadores`);
    
    for (const coord of coordinadores) {
      const usuario = `coord${coord.id_Coordinador}`; // Usuario = coord + id
      const contraseña = `${coord.nombre.substring(0, 3).toLowerCase()}${coord.apellidoPaterno.substring(0, 3).toLowerCase()}`; // Ej: "luimar"
      const contraseñaHash = await bcrypt.hash(contraseña, 10);
      
      await connection.query(
        'INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)',
        [usuario, contraseñaHash, 'COORDINADOR', coord.id_Coordinador]
      );
      
      console.log(`   ✓ ${usuario} / ${contraseña} (${coord.nombre} ${coord.apellidoPaterno})`);
      totalCreados++;
    }
    console.log(`\n✅ ${coordinadores.length} coordinadores creados\n`);

    // ================================
    // 6. CREAR USUARIOS PARA DIRECTIVOS
    // ================================
    console.log('🎩 Creando usuarios para DIRECTIVOS...');
    const [directivos] = await connection.query(`
      SELECT d.id_Directivo, dp.nombre, dp.apellidoPaterno 
      FROM Directivo d 
      JOIN Empleado e ON d.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY d.id_Directivo
    `);
    
    console.log(`   📚 Encontrados ${directivos.length} directivos`);
    
    for (const dir of directivos) {
      const usuario = `dir${dir.id_Directivo}`; // Usuario = dir + id
      const contraseña = `${dir.nombre.substring(0, 3).toLowerCase()}${dir.apellidoPaterno.substring(0, 3).toLowerCase()}`; // Ej: "carsan"
      const contraseñaHash = await bcrypt.hash(contraseña, 10);
      
      await connection.query(
        'INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)',
        [usuario, contraseñaHash, 'DIRECTIVO', dir.id_Directivo]
      );
      
      console.log(`   ✓ ${usuario} / ${contraseña} (${dir.nombre} ${dir.apellidoPaterno})`);
      totalCreados++;
    }
    console.log(`\n✅ ${directivos.length} directivos creados\n`);

    // ================================
    // RESUMEN FINAL
    // ================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 PROCESO COMPLETADO');
    console.log('='.repeat(60));
    console.log(`📊 Total de usuarios creados: ${totalCreados}`);
    console.log(`   - Estudiantes: ${estudiantes.length}`);
    console.log(`   - Profesores: ${profesores.length}`);
    console.log(`   - Administradores: ${administradores.length}`);
    console.log(`   - Coordinadores: ${coordinadores.length}`);
    console.log(`   - Directivos: ${directivos.length}`);
    console.log('='.repeat(60));
    console.log('\n💡 PATRONES DE ACCESO:');
    console.log('   ESTUDIANTES: usuario = nControl, contraseña = primeras3letrasNombre + año');
    console.log('   PROFESORES: usuario = prof[id], contraseña = primeras3letrasNombre + primeras3letrasApellido');
    console.log('   ADMINS: usuario = admin[id], contraseña = primeras3letrasNombre + primeras3letrasApellido');
    console.log('   COORDINADORES: usuario = coord[id], contraseña = primeras3letrasNombre + primeras3letrasApellido');
    console.log('   DIRECTIVOS: usuario = dir[id], contraseña = primeras3letrasNombre + primeras3letrasApellido');
    console.log('\n✅ Todos los usuarios pueden acceder ahora sin limitantes\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script
crearUsuariosCompleto();
