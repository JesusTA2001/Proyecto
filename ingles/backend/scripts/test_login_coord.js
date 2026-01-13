const axios = require('axios');

async function testLogin() {
  try {
    console.log('Probando login con usuario: coord1, contraseña: 123456');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      usuario: 'coord1',
      contraseña: '123456'
    });

    console.log('✅ Login exitoso!');
    console.log('Token:', response.data.token);
    console.log('Usuario:', response.data.user);
    console.log('Rol:', response.data.user.rol);
  } catch (error) {
    console.error('❌ Error en login:');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data?.message);
    console.error('Cuerpo:', error.response?.data);
  }
}

testLogin();
