const axios = require('axios');

async function probarAPI() {
  try {
    console.log('Probando endpoint: GET /api/alumnos\n');
    
    const response = await axios.get('http://localhost:5000/api/alumnos', {
      headers: {
        'Authorization': 'Bearer temp_token_test'
      }
    });

    console.log('✓ Respuesta exitosa!');
    console.log(`Total de alumnos: ${response.data.length}`);
    console.log('\nPrimeros 3 alumnos:');
    response.data.slice(0, 3).forEach((alumno, index) => {
      console.log(`\n${index + 1}. ${alumno.apellidoPaterno} ${alumno.apellidoMaterno} ${alumno.nombre}`);
      console.log(`   nControl: ${alumno.nControl}`);
      console.log(`   Email: ${alumno.email}`);
      console.log(`   Nivel: ${alumno.nivel}`);
    });

  } catch (error) {
    console.error('❌ Error al consultar la API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    console.error('\nDetalles completos:', error);
  }
}probarAPI();
