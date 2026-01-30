const { pool } = require('../config/db');
const axios = require('axios');

// Cambiar según el entorno
const API_URL = 'http://localhost:3001'; // Para pruebas locales
// const API_URL = 'https://tu-app.azurewebsites.net'; // Para Azure

async function probarLoginCoordinadoresDirectivos() {
  try {
    console.log('🧪 PRUEBA DE LOGIN - COORDINADORES Y DIRECTIVOS\n');
    console.log('='.repeat(80));
    console.log(`API URL: ${API_URL}\n`);

    // 1. Verificar contraseñas en la base de datos
    console.log('📋 1. VERIFICANDO CONTRASEÑAS EN LA BASE DE DATOS:\n');
    
    const [coord1] = await pool.query(`
      SELECT usuario, contraseña, rol 
      FROM usuarios 
      WHERE usuario = 'coord1'
    `);
    
    const [dir1] = await pool.query(`
      SELECT usuario, contraseña, rol 
      FROM usuarios 
      WHERE usuario = 'dir1'
    `);
    
    console.log('Coordinador 1:');
    console.table(coord1);
    
    console.log('\nDirectivo 1:');
    console.table(dir1);

    // 2. Probar login de coordinadores
    console.log('\n' + '='.repeat(80));
    console.log('🔐 2. PROBANDO LOGIN DE COORDINADORES:\n');
    
    const coordinadores = ['coord1', 'coord2', 'coord3'];
    
    for (const coord of coordinadores) {
      try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          usuario: coord,
          contraseña: '123456'
        });
        
        console.log(`✅ ${coord}: Login exitoso`);
        console.log(`   - Token recibido: ${response.data.token.substring(0, 20)}...`);
        console.log(`   - Rol: ${response.data.user.rol}`);
        console.log(`   - Nombre: ${response.data.user.nombre} ${response.data.user.apellidoPaterno}`);
      } catch (error) {
        if (error.response) {
          console.log(`❌ ${coord}: ${error.response.data.message}`);
        } else {
          console.log(`❌ ${coord}: Error de conexión - ${error.message}`);
          console.log('   ⚠️  Asegúrate de que el servidor esté corriendo en:', API_URL);
        }
      }
    }

    // 3. Probar login de directivos
    console.log('\n' + '='.repeat(80));
    console.log('🔐 3. PROBANDO LOGIN DE DIRECTIVOS:\n');
    
    const directivos = ['dir1', 'dir2', 'dir3'];
    
    for (const dir of directivos) {
      try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          usuario: dir,
          contraseña: '123456'
        });
        
        console.log(`✅ ${dir}: Login exitoso`);
        console.log(`   - Token recibido: ${response.data.token.substring(0, 20)}...`);
        console.log(`   - Rol: ${response.data.user.rol}`);
        console.log(`   - Nombre: ${response.data.user.nombre} ${response.data.user.apellidoPaterno}`);
      } catch (error) {
        if (error.response) {
          console.log(`❌ ${dir}: ${error.response.data.message}`);
        } else {
          console.log(`❌ ${dir}: Error de conexión - ${error.message}`);
          console.log('   ⚠️  Asegúrate de que el servidor esté corriendo en:', API_URL);
        }
      }
    }

    // 4. Comparar con un profesor (que tiene hash)
    console.log('\n' + '='.repeat(80));
    console.log('🔐 4. COMPARACIÓN CON PROFESOR (CON HASH):\n');
    
    const [prof1] = await pool.query(`
      SELECT usuario, contraseña, rol 
      FROM usuarios 
      WHERE usuario = 'prof1'
    `);
    
    console.log('Profesor 1 (contraseña hasheada):');
    console.table([{
      usuario: prof1[0].usuario,
      contraseña: prof1[0].contraseña.substring(0, 30) + '...',
      rol: prof1[0].rol
    }]);

    console.log('\n' + '='.repeat(80));
    console.log('✅ PRUEBA COMPLETADA\n');
    console.log('📌 RESUMEN:');
    console.log('   - Coordinadores: contraseña en texto plano (123456)');
    console.log('   - Directivos: contraseña en texto plano (123456)');
    console.log('   - Profesores: contraseña hasheada (bcrypt)');
    console.log('\n💡 Si el servidor no está corriendo, inicia con:');
    console.log('   cd backend');
    console.log('   node server.js');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  } finally {
    await pool.end();
  }
}

probarLoginCoordinadoresDirectivos();
