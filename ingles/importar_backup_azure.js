const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

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
  },
  multipleStatements: true // Permitir múltiples declaraciones SQL
});

async function importarBackupAzure() {
  let connection;
  
  try {
    console.log('🔄 Importando backup completo a AZURE...\n');

    // Leer el archivo SQL
    const backupPath = path.join(__dirname, 'backend', 'scripts', 'proyectoingles_backup.sql');
    
    if (!fs.existsSync(backupPath)) {
      console.error('❌ No se encontró el archivo de backup en:', backupPath);
      process.exit(1);
    }

    const sqlContent = fs.readFileSync(backupPath, 'utf8');
    console.log('📂 Archivo de backup cargado correctamente');
    console.log(`📊 Tamaño: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

    // Obtener conexión
    connection = await poolAzure.getConnection();
    console.log('✅ Conectado a Azure MySQL\n');

    // Dividir el SQL en declaraciones individuales y filtrar
    console.log('🔧 Procesando declaraciones SQL...\n');
    
    // Eliminar comentarios y dividir por declaraciones
    const statements = sqlContent
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed && 
               !trimmed.startsWith('--') && 
               !trimmed.startsWith('/*') &&
               !trimmed.startsWith('*') &&
               !trimmed.startsWith('CREATE DATABASE') && // Skip CREATE DATABASE
               !trimmed.startsWith('USE `'); // Skip USE statement ya que ya estamos conectados
      })
      .join('\n');

    // Ejecutar en bloques más pequeños
    const comandos = statements.split(';').filter(cmd => cmd.trim().length > 0);
    
    console.log(`📝 Total de comandos SQL a ejecutar: ${comandos.length}\n`);

    let exitosos = 0;
    let fallidos = 0;
    let omitidos = 0;

    for (let i = 0; i < comandos.length; i++) {
      const comando = comandos[i].trim();
      
      if (!comando || comando.length < 10) {
        omitidos++;
        continue;
      }

      try {
        // Detectar tipo de comando
        let tipo = 'QUERY';
        if (comando.toUpperCase().startsWith('DROP TABLE')) tipo = 'DROP';
        else if (comando.toUpperCase().startsWith('CREATE TABLE')) tipo = 'CREATE';
        else if (comando.toUpperCase().startsWith('INSERT INTO')) tipo = 'INSERT';
        else if (comando.toUpperCase().startsWith('ALTER TABLE')) tipo = 'ALTER';
        else if (comando.toUpperCase().startsWith('LOCK TABLES')) tipo = 'LOCK';
        else if (comando.toUpperCase().startsWith('UNLOCK TABLES')) tipo = 'UNLOCK';

        await connection.query(comando);
        exitosos++;
        
        if (tipo === 'CREATE' || tipo === 'INSERT') {
          // Extraer nombre de tabla
          const match = comando.match(/(?:CREATE TABLE|INSERT INTO)\s+`?(\w+)`?/i);
          const tabla = match ? match[1] : '';
          console.log(`✅ [${i+1}/${comandos.length}] ${tipo} ${tabla}`);
        } else if (i % 50 === 0) {
          console.log(`⏳ Procesando... ${i}/${comandos.length}`);
        }

      } catch (err) {
        fallidos++;
        
        // Algunos errores son esperados (como DROP TABLE si no existe)
        if (err.message.includes("doesn't exist") || 
            err.message.includes("Unknown table") ||
            err.message.includes("Duplicate entry")) {
          omitidos++;
        } else {
          console.error(`❌ Error en comando ${i+1}:`, err.message.substring(0, 100));
        }
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 RESUMEN DE IMPORTACIÓN`);
    console.log(`${'='.repeat(50)}`);
    console.log(`✅ Comandos exitosos: ${exitosos}`);
    console.log(`❌ Comandos fallidos: ${fallidos}`);
    console.log(`⏭️  Comandos omitidos: ${omitidos}`);
    console.log(`📈 Total procesados: ${comandos.length}`);
    console.log(`${'='.repeat(50)}\n`);

    // Verificar datos importados
    console.log('🔍 Verificando datos importados...\n');

    const tablas = [
      'usuario',
      'empleado', 
      'estudiante',
      'profesor',
      'administrador',
      'Periodo',
      'Nivel',
      'Grupo',
      'EstudianteGrupo',
      'Calificaciones',
      'Asistencia'
    ];

    for (const tabla of tablas) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as total FROM ${tabla}`);
        console.log(`📊 ${tabla.padEnd(20)} -> ${rows[0].total} registros`);
      } catch (err) {
        console.log(`⚠️  ${tabla.padEnd(20)} -> Tabla no existe o error`);
      }
    }

    console.log('\n✅ Importación completada!\n');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    console.error(error.stack);
  } finally {
    if (connection) connection.release();
    await poolAzure.end();
    process.exit(0);
  }
}

// Ejecutar
importarBackupAzure();
