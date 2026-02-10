// Script para verificar el estado de Azure directamente
// Ejecuta esto en la consola del navegador (F12) cuando estés en tu aplicación de Azure

console.log('🔍 VERIFICANDO ESTADO DE AZURE...\n');

// 1. Verificar períodos
fetch('/api/periodos')
  .then(res => res.json())
  .then(data => {
    console.log('✅ PERÍODOS RECIBIDOS:', data);
    console.table(data);
  })
  .catch(err => console.error('❌ ERROR PERÍODOS:', err));

// 2. Verificar historial de grupos
fetch('/api/grupos/historial')
  .then(res => res.json())
  .then(data => {
    console.log('\n✅ HISTORIAL GRUPOS:', data);
    if (data.grupos) {
      console.table(data.grupos);
    }
  })
  .catch(err => console.error('❌ ERROR HISTORIAL:', err));

// 3. Verificar estudiantes
fetch('/api/alumnos')
  .then(res => res.json())
  .then(data => {
    console.log('\n✅ ESTUDIANTES:', data.length, 'alumnos');
    console.table(data.slice(0, 5)); // Mostrar solo los primeros 5
  })
  .catch(err => console.error('❌ ERROR ESTUDIANTES:', err));
