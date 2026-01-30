// Script simplificado para prueba
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'mysqlingles.mysql.database.azure.com',
    user: 'admin_ingles',
    password: 'Gui11ermo1',
    database: 'proyectoIngles',
    ssl: 'Amazon RDS'
  });

  console.log('Conectado a BD Azure');

  // Agregar columnas a Periodo
  try {
    await connection.query(`ALTER TABLE Periodo ADD COLUMN fecha_inicio DATE`);
  } catch (e) {
    console.log('fecha_inicio ya existe');
  }

  try {
    await connection.query(`ALTER TABLE Periodo ADD COLUMN fecha_fin DATE`);
  } catch (e) {
    console.log('fecha_fin ya existe');
  }

  try {
    await connection.query(`ALTER TABLE Periodo ADD COLUMN estado VARCHAR(50)`);
  } catch (e) {
    console.log('estado ya existe');
  }

  // Insertar datos
  const [periodo] = await connection.query(
    'INSERT INTO Periodo (descripcion, año, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
    ['PERIODO TEST', 2026, '2025-01-01', '2025-12-31', 'Finalizado']
  );

  const periodo_id = periodo.insertId;
  console.log('Periodo ID:', periodo_id);

  const [grupo] = await connection.query(
    'INSERT INTO Grupo (grupo, id_Periodo, id_Profesor, id_Nivel, ubicacion, id_cHorario) VALUES (?, ?, ?, ?, ?, ?)',
    ['TEST-GRUPO', periodo_id, 1, 1, 'Aula Test', 1]
  );

  const grupo_id = grupo.insertId;
  console.log('Grupo ID:', grupo_id);

  await connection.query(
    'INSERT INTO EstudianteGrupo (nControl, id_Grupo, estado) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
    ['TEST001', grupo_id, 'concluido', 'TEST002', grupo_id, 'concluido', 'TEST003', grupo_id, 'concluido']
  );

  await connection.query(
    'INSERT INTO Calificaciones (nControl, parcial1, parcial2, parcial3, final, id_nivel, id_Periodo, id_Grupo) VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)',
    ['TEST001', 85, 90, 88, 87.67, 1, periodo_id, grupo_id, 'TEST002', 75, 78, 80, 77.67, 1, periodo_id, grupo_id, 'TEST003', 92, 95, 93, 93.33, 1, periodo_id, grupo_id]
  );

  console.log('✅ Datos insertados exitosamente');

  await connection.end();
}

run().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
