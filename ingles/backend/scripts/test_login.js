const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔐 Probando login con usuario 1000...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      usuario: '1000',
      contraseña: 'sil2025'
    }, {
      timeout: 5000
    });
    
    console.log('✅ Login exitoso!');
    console.log('📊 Datos recibidos:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error en login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Mensaje:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No hubo respuesta del servidor');
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();
