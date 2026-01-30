const mysql = require('mysql2/promise');
const fs = require('fs');

// CONEXIÓN AZURE
const poolAzure = mysql.createPool({
  host: 'mysqlingles.mysql.database.azure.com',
  user: 'admin_ingles',
  password: 'Gui11ermo1',
  database: 'proyectoIngles',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});

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

async function importarPeriodosAzure() {
  try {
    console.log('🔄 Importando períodos de LOCAL a AZURE...\n');

    // Obtener períodos de local
    const [periodosLocal] = await poolLocal.query(`
      SELECT * FROM Periodo ORDER BY año DESC, id_Periodo DESC
    `);

    console.log(`📥 Encontrados ${periodosLocal.length} períodos en LOCAL`);

    // Verificar períodos existentes en Azure
    const [periodosAzure] = await poolAzure.query(`
      SELECT * FROM Periodo
    `);

    console.log(`📊 Períodos actuales en AZURE: ${periodosAzure.length}\n`);

    let insertados = 0;
    let omitidos = 0;

    for (const p of periodosLocal) {
      // Verificar si ya existe
      const existe = periodosAzure.find(pa => pa.id_Periodo === p.id_Periodo);
      
      if (existe) {
        console.log(`⏭️  Período ${p.descripcion} (ID: ${p.id_Periodo}) ya existe, omitiendo...`);
        omitidos++;
      } else {
        try {
          await poolAzure.query(`
            INSERT INTO Periodo (id_Periodo, año, descripcion, fecha_inicio, fecha_fin)
            VALUES (?, ?, ?, ?, ?)
          `, [p.id_Periodo, p.año, p.descripcion, p.fecha_inicio, p.fecha_fin]);
          
          console.log(`✅ Insertado: ${p.descripcion} (${p.año})`);
          insertados++;
        } catch (err) {
          console.error(`❌ Error insertando ${p.descripcion}:`, err.message);
        }
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Insertados: ${insertados}`);
    console.log(`   ⏭️  Omitidos: ${omitidos}`);
    console.log(`   📈 Total en Azure: ${periodosAzure.length + insertados}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await poolLocal.end();
    await poolAzure.end();
    process.exit(0);
  }
}

importarPeriodosAzure();
