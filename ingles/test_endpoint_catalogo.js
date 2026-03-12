async function probarEndpoint() {
  try {
    console.log('🔍 Probando endpoint /estudios/catalogo...\n');
    
    // Usaremos fetch nativo de Node
    const baseURL = 'http://localhost:5000/api';
    const url = `${baseURL}/estudios/catalogo`;
    
    console.log(`📡 Haciendo petición a: ${url}\n`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('✅ Respuesta recibida:\n');
    console.log('Status:', response.status);
    console.log('Data:', data);
    console.log('\n📊 Cantidad de registros:', data.length);
    console.table(data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

probarEndpoint();
