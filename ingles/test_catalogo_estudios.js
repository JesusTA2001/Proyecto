const axios = require('axios');

async function testCatalogoEstudios() {
  try {
    console.log('Probando endpoint del catálogo de estudios...');
    
    // Primero conseguir un token válido (login como admin)
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      usuario: 'admin1',
      contraseña: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Login exitoso, token obtenido');
    
    // Ahora probar el endpoint del catálogo
    const response = await axios.get('http://localhost:5000/api/estudios/catalogo', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('\n📚 Catálogo de Estudios:');
    console.log(response.data);
    
    if (response.data.length === 0) {
      console.log('\n⚠️  El catálogo está vacío');
    } else {
      console.log(`\n✓ Total de niveles de estudio: ${response.data.length}`);
      response.data.forEach(nivel => {
        console.log(`  - ${nivel.id_Estudio}: ${nivel.nivelEstudio}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCatalogoEstudios();
