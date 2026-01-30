const mysql = require('mysql2/promise');
const fs = require('fs');

// CONEXIÓN LOCAL
const poolLocal = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proyectoingles',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function exportarPeriodos() {
  try {
    console.log('📤 Exportando períodos de base de datos LOCAL...\n');

    const [periodos] = await poolLocal.query(`
      SELECT * FROM Periodo ORDER BY año DESC, id_Periodo DESC
    `);

    console.log(`✅ Encontrados ${periodos.length} períodos:\n`);
    console.table(periodos);

    // Generar SQL INSERT
    let sqlStatements = '-- INSERTAR PERÍODOS EN AZURE\n\n';
    
    for (const p of periodos) {
      const descripcion = p.descripcion ? `'${p.descripcion}'` : 'NULL';
      const fechaInicio = p.fecha_inicio ? `'${p.fecha_inicio}'` : 'NULL';
      const fechaFin = p.fecha_fin ? `'${p.fecha_fin}'` : 'NULL';
      
      sqlStatements += `INSERT INTO Periodo (id_Periodo, año, descripcion, fecha_inicio, fecha_fin) VALUES (${p.id_Periodo}, ${p.año}, ${descripcion}, ${fechaInicio}, ${fechaFin});\n`;
    }

    // Guardar en archivo
    const fileName = 'periodos_export.sql';
    fs.writeFileSync(fileName, sqlStatements);
    
    console.log(`\n✅ SQL exportado a: ${fileName}`);
    console.log('\n📋 Opciones para importar a Azure:');
    console.log('1. Ejecuta: node backend/importar_periodos_azure.js');
    console.log('2. O copia el contenido de periodos_export.sql y ejecútalo manualmente en Azure');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await poolLocal.end();
    process.exit(0);
  }
}

exportarPeriodos();
