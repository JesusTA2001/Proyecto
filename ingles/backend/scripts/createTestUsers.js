const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

async function crearUsuariosPrueba() {
  const connection = await pool.getConnection();
  
  try {
    // Generar hashes para las contraseñas
    const hashAdmin = await bcrypt.hash('admin123', 10);
    const hashProf = await bcrypt.hash('prof123', 10);
    const hashAlum = await bcrypt.hash('alum123', 10);

    console.log('='.repeat(60));
    console.log('CREANDO USUARIOS DE PRUEBA');
    console.log('='.repeat(60));

    // ============ ADMINISTRADOR ============
    console.log('\n1. Creando Administrador...');
    await connection.beginTransaction();

    const [dpAdmin] = await connection.query(
      `INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['García', 'López', 'Carlos', 'admin1@teczamora.edu.mx', 'Masculino', 'GALC850615HJCRPR01', '3511234567', 'Av. Tecnológico 100']
    );

    const [empleadoAdmin] = await connection.query(
      `INSERT INTO Empleado (id_dp, ubicacion, estado) VALUES (?, ?, ?)`,
      [dpAdmin.insertId, 'Tecnologico', 'activo']
    );

    const [adminResult] = await connection.query(
      `INSERT INTO Administrador (id_empleado, gradoEstudio) VALUES (?, ?)`,
      [empleadoAdmin.insertId, 'Maestría']
    );

    await connection.query(
      `INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)`,
      ['admin1', hashAdmin, 'ADMINISTRADOR', adminResult.insertId]
    );

    await connection.commit();
    console.log('✓ Administrador creado: usuario=admin1, contraseña=admin123');

    // ============ PROFESOR ============
    console.log('\n2. Creando Profesor...');
    await connection.beginTransaction();

    const [dpProf] = await connection.query(
      `INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Martínez', 'Sánchez', 'Juan', 'profesor1@teczamora.edu.mx', 'Masculino', 'MASJ800312HJCRNR02', '3519876543', 'Calle Principal 200']
    );

    const [empleadoProf] = await connection.query(
      `INSERT INTO Empleado (id_dp, ubicacion, estado) VALUES (?, ?, ?)`,
      [dpProf.insertId, 'Tecnologico', 'activo']
    );

    const [profResult] = await connection.query(
      `INSERT INTO Profesor (id_empleado, numero_empleado, RFC, nivelEstudio) VALUES (?, ?, ?, ?)`,
      [empleadoProf.insertId, 'EMP001', 'MASJ800312ABC', 'Doctorado']
    );

    await connection.query(
      `INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)`,
      ['prof1', hashProf, 'PROFESOR', profResult.insertId]
    );

    await connection.commit();
    console.log('✓ Profesor creado: usuario=prof1, contraseña=prof123');

    // ============ ESTUDIANTE ============
    console.log('\n3. Creando Estudiante...');
    await connection.beginTransaction();

    const [dpAlum] = await connection.query(
      `INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Hernández', 'Ramírez', 'María', 'alumna1@teczamora.edu.mx', 'Femenino', 'HERM020815MJCRMR03', '3517894561', 'Colonia Centro 300']
    );

    const nControl = 2112345;

    await connection.query(
      `INSERT INTO Estudiante (nControl, id_dp, estado, ubicacion) VALUES (?, ?, ?, ?)`,
      [nControl, dpAlum.insertId, 'activo', 'Tecnologico']
    );

    await connection.query(
      `INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion) VALUES (?, ?, ?, ?)`,
      ['alumno1', hashAlum, 'ESTUDIANTE', nControl]
    );

    await connection.commit();
    console.log('✓ Estudiante creado: usuario=alumno1, contraseña=alum123');

    console.log('\n' + '='.repeat(60));
    console.log('USUARIOS CREADOS EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('\nCredenciales de acceso:');
    console.log('1. Administrador: admin1 / admin123');
    console.log('2. Profesor: prof1 / prof123');
    console.log('3. Estudiante: alumno1 / alum123');
    console.log('='.repeat(60));

  } catch (error) {
    await connection.rollback();
    console.error('\n❌ Error al crear usuarios:', error.message);
    
    // Si el error es por duplicado, informar
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('\n⚠️  Los usuarios ya existen en la base de datos.');
      console.log('Puedes usar las siguientes credenciales:');
      console.log('1. Administrador: admin1 / admin123');
      console.log('2. Profesor: prof1 / prof123');
      console.log('3. Estudiante: alumno1 / alum123');
    }
  } finally {
    connection.release();
    process.exit(0);
  }
}

// Ejecutar el script
crearUsuariosPrueba();
