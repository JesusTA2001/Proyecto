// Script para generar hashes bcrypt para las contraseñas
const bcrypt = require('bcrypt');

const password = 'password123';
const saltRounds = 10;

console.log('Generando hash para password: "password123"\n');

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('Hash generado:');
  console.log(hash);
  console.log('\nCopia este hash y úsalo en el script SQL');
});
