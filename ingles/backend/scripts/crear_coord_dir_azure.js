const mysql = require('mysql2/promise');

// Configuración de conexión a Azure
const config = {
  host: 'mysqlingles.mysql.database.azure.com',
  user: 'adminuser@mysqlingles',
  password: 'TecZamora.2024!',
  database: 'proyectoIngles',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function crearCoordinadoresYDirectivos() {
  const connection = await mysql.createConnection(config);
  try {
    console.log('Conectado a Azure MySQL');
    console.log('Creando coordinadores y directivos con sus datos personales...\n');

    // Datos de coordinadores
    const coordinadores = [
      { id: 1, nombre: 'Carlos', apellidoP: 'García', apellidoM: 'López', email: 'coord1@teczamora.edu.mx', usuario: 'coord1' },
      { id: 2, nombre: 'María', apellidoP: 'Martínez', apellidoM: 'Sánchez', email: 'coord2@teczamora.edu.mx', usuario: 'coord2' },
      { id: 3, nombre: 'Juan', apellidoP: 'Hernández', apellidoM: 'Ramírez', email: 'coord3@teczamora.edu.mx', usuario: 'coord3' },
      { id: 4, nombre: 'Ana', apellidoP: 'López', apellidoM: 'Gómez', email: 'coord4@teczamora.edu.mx', usuario: 'coord4' },
      { id: 5, nombre: 'Pedro', apellidoP: 'Rodríguez', apellidoM: 'Pérez', email: 'coord5@teczamora.edu.mx', usuario: 'coord5' },
      { id: 6, nombre: 'Sandra', apellidoP: 'Díaz', apellidoM: 'García', email: 'coord6@teczamora.edu.mx', usuario: 'coord6' },
      { id: 7, nombre: 'Ricardo', apellidoP: 'Morales', apellidoM: 'Silva', email: 'coord7@teczamora.edu.mx', usuario: 'coord7' },
      { id: 8, nombre: 'Patricia', apellidoP: 'Flores', apellidoM: 'Mendoza', email: 'coord8@teczamora.edu.mx', usuario: 'coord8' },
      { id: 9, nombre: 'Fernando', apellidoP: 'Ríos', apellidoM: 'Castro', email: 'coord9@teczamora.edu.mx', usuario: 'coord9' }
    ];

    // Datos de directivos
    const directivos = [
      { id: 1, nombre: 'Guillermo', apellidoP: 'Sandoval', apellidoM: 'Cruz', email: 'dir1@teczamora.edu.mx', usuario: 'dir1' },
      { id: 2, nombre: 'Rosario', apellidoP: 'Delgado', apellidoM: 'Vázquez', email: 'dir2@teczamora.edu.mx', usuario: 'dir2' },
      { id: 3, nombre: 'Miguel', apellidoP: 'Torres', apellidoM: 'Núñez', email: 'dir3@teczamora.edu.mx', usuario: 'dir3' }
    ];

    // Crear coordinadores
    console.log('👔 Creando COORDINADORES...');
    for (const coord of coordinadores) {
      try {
        // 1. Insertar datos personales
        const [dpResult] = await connection.query(
          `INSERT INTO DatosPersonales (nombre, apellidoPaterno, apellidoMaterno, email, genero) 
           VALUES (?, ?, ?, ?, ?)`,
          [coord.nombre, coord.apellidoP, coord.apellidoM, coord.email, 'Masculino']
        );

        // 2. Insertar empleado
        const [empResult] = await connection.query(
          `INSERT INTO Empleado (id_dp, estado) VALUES (?, ?)`,
          [dpResult.insertId, 'activo']
        );

        // 3. Insertar coordinador
        const [coordResult] = await connection.query(
          `INSERT INTO Coordinador (id_empleado, estado) VALUES (?, ?)`,
          [empResult.insertId, 'activo']
        );

        // 4. Actualizar id_relacion en Usuarios
        await connection.query(
          `UPDATE Usuarios SET id_relacion = ? WHERE usuario = ?`,
          [coordResult.insertId, coord.usuario]
        );

        console.log(`✓ ${coord.usuario} -> Coordinador ID ${coordResult.insertId} creado`);
      } catch (err) {
        console.error(`✗ Error creando ${coord.usuario}:`, err.message);
      }
    }

    // Crear directivos
    console.log('\n🎩 Creando DIRECTIVOS...');
    for (const dir of directivos) {
      try {
        // 1. Insertar datos personales
        const [dpResult] = await connection.query(
          `INSERT INTO DatosPersonales (nombre, apellidoPaterno, apellidoMaterno, email, genero) 
           VALUES (?, ?, ?, ?, ?)`,
          [dir.nombre, dir.apellidoP, dir.apellidoM, dir.email, 'Masculino']
        );

        // 2. Insertar empleado
        const [empResult] = await connection.query(
          `INSERT INTO Empleado (id_dp, estado) VALUES (?, ?)`,
          [dpResult.insertId, 'activo']
        );

        // 3. Insertar directivo
        const [dirResult] = await connection.query(
          `INSERT INTO Directivo (id_empleado, estado) VALUES (?, ?)`,
          [empResult.insertId, 'activo']
        );

        // 4. Actualizar id_relacion en Usuarios
        await connection.query(
          `UPDATE Usuarios SET id_relacion = ? WHERE usuario = ?`,
          [dirResult.insertId, dir.usuario]
        );

        console.log(`✓ ${dir.usuario} -> Directivo ID ${dirResult.insertId} creado`);
      } catch (err) {
        console.error(`✗ Error creando ${dir.usuario}:`, err.message);
      }
    }

    console.log('\n✅ Coordinadores y directivos creados exitosamente con sus datos personales.');

  } catch (error) {
    console.error('Error fatal:', error);
  } finally {
    await connection.end();
  }
}

crearCoordinadoresYDirectivos();
