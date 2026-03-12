// Script para verificar si JWT_SECRET está configurado en Azure
const axios = require('axios');

const API_URL = 'https://gray-beach-0cdc4470f.3.azurestaticapps.net/api';

async function verificarJWT() {
  console.log('🔍 Verificando configuración de JWT en producción...\n');
  
  try {
    // Intentar login con usuario de prueba
    const response = await axios.post(`${API_URL}/auth/login`, {
      usuario: 'admin1',
      contraseña: '123456'
    });
    
    if (response.data.token) {
      console.log('✅ JWT_SECRET está configurado correctamente');
      console.log(`📝 Token generado (primeros 20 caracteres): ${response.data.token.substring(0, 20)}...`);
      console.log(`👤 Usuario autenticado: ${response.data.user?.usuario}`);
      console.log(`🎭 Rol: ${response.data.user?.rol}`);
      return true;
    } else {
      console.log('❌ No se generó token JWT');
      return false;
    }
    
  } catch (error) {
    if (error.response) {
      console.log(`❌ Error ${error.response.status}: ${error.response.data?.message || 'Error desconocido'}`);
      
      if (error.response.status === 500 && error.response.data?.message?.includes('jwt')) {
        console.log('\n⚠️  DIAGNÓSTICO:');
        console.log('El error sugiere que JWT_SECRET NO está configurado en Azure.');
        console.log('\n📋 SOLUCIÓN:');
        console.log('1. Abre el portal de Azure: https://portal.azure.com');
        console.log('2. Busca tu Static Web App: gray-beach-0cdc4470f');
        console.log('3. Ve a Configuration > Application Settings');
        console.log('4. Agrega la variable: JWT_SECRET con un valor seguro');
        console.log('5. Guarda y reinicia la aplicación');
        console.log('\n📖 Ver guía completa: CONFIGURAR_JWT_AZURE.md');
      }
    } else {
      console.log('❌ Error de conexión:', error.message);
      console.log('Verifica que el backend esté funcionando en Azure');
    }
    return false;
  }
}

verificarJWT();
