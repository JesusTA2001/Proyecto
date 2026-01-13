const axios = require('axios');

async function test() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      usuario: 'coord1',
      contraseña: '123456'
    });
    console.log('✅ LOGIN EXITOSO');
    console.log('Usuario:', response.data.user.usuario);
    console.log('Rol:', response.data.user.rol);
    console.log('ID Relación:', response.data.user.id_relacion);
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('\n📋 Datos del coordinador:');
    console.log(JSON.stringify(response.data.user, null, 2));
  } catch (error) {
    if (error.response?.data) {
      console.error('❌ ERROR:', error.response.data);
    } else {
      console.error('❌ ERROR:', error.message);
      console.error('Detalles:', error);
    }
  }
}

test();
