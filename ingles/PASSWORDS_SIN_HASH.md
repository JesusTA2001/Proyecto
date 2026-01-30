# 🔓 Contraseñas Sin Hasheo - Coordinadores y Directivos

## ✅ Cambio Realizado

Se han actualizado las contraseñas de **coordinadores** y **directivos** para que sean en **texto plano** (sin hasheo bcrypt), facilitando el proceso de login.

---

## 📊 Estado Actual

### Usuarios Actualizados

| Rol | Cantidad | Contraseña | Estado |
|-----|----------|------------|--------|
| **Coordinadores** | 9 | `123456` (texto plano) | ✅ Actualizado |
| **Directivos** | 3 | `123456` (texto plano) | ✅ Actualizado |
| Profesores | 21 | `123456` (texto plano) | Sin cambios |
| Estudiantes | 301 | Varias | Sin cambios |

---

## 🔐 Credenciales de Acceso

### Coordinadores (9 usuarios)
```
coord1 / 123456
coord2 / 123456
coord3 / 123456
coord4 / 123456
coord5 / 123456
coord6 / 123456
coord7 / 123456
coord8 / 123456
coord9 / 123456
```

### Directivos (3 usuarios)
```
dir1 / 123456
dir2 / 123456
dir3 / 123456
```

---

## ✅ Verificación del Sistema

### Tests Realizados

✅ **TEST 1: Login Coordinador**
- Usuario: coord1
- Contraseña: 123456
- Resultado: ✅ Login exitoso
- Datos recuperados correctamente

✅ **TEST 2: Login Directivo**
- Usuario: dir1
- Contraseña: 123456
- Resultado: ✅ Login exitoso
- Datos recuperados correctamente

✅ **TEST 3: Seguridad**
- Contraseñas incorrectas son rechazadas
- Sistema funciona correctamente

---

## 🏗️ Funcionamiento Técnico

### Lógica de Autenticación (authController.js)

El sistema detecta automáticamente el tipo de contraseña:

```javascript
// Si la contraseña empieza con '$2' → bcrypt hash
if (passwordFromDB.startsWith('$2')) {
  isMatch = await bcrypt.compare(contraseña, passwordFromDB);
} 
// Si no → comparación directa (texto plano)
else {
  isMatch = contraseña === passwordFromDB;
}
```

### Beneficios de Esta Implementación

1. ✅ **Flexible**: Soporta ambos tipos de contraseñas
2. ✅ **Sin cambios en código**: El authController ya tenía esta lógica
3. ✅ **Retrocompatible**: Otros usuarios no se ven afectados
4. ✅ **Fácil de usar**: Login simple sin problemas de hash

---

## 🗄️ Cambios en la Base de Datos

### Antes
```sql
-- Contraseñas hasheadas con bcrypt
coord1: $2b$10$VJpChhpOf11MXmFhZ3SEiOHoJYZVulMJ8TpGMXUfZT/JpJPbN6KxS
dir1:   $2b$10$VJpChhpOf11MXmFhZ3SEiOHoJYZVulMJ8TpGMXUfZT/JpJPbN6KxS
```

### Después
```sql
-- Contraseñas en texto plano
coord1: 123456
dir1:   123456
```

### Query Ejecutado
```sql
-- Coordinadores
UPDATE usuarios 
SET contraseña = '123456' 
WHERE rol = 'COORDINADOR';

-- Directivos
UPDATE usuarios 
SET contraseña = '123456' 
WHERE rol = 'DIRECTIVO';
```

**Resultado:**
- 9 coordinadores actualizados ✅
- 3 directivos actualizados ✅

---

## 🛠️ Scripts Disponibles

### 1. Verificar Contraseñas
```bash
node backend/scripts/verificar_passwords_final.js
```
Muestra todas las contraseñas actuales de coordinadores y directivos.

### 2. Simular Login
```bash
node backend/scripts/test_login_simulado.js
```
Simula el proceso completo de login sin necesidad de tener el servidor corriendo.

### 3. Re-aplicar el Cambio (si es necesario)
```bash
node backend/scripts/quitar_hash_coord_dir.js
```
Vuelve a establecer las contraseñas en texto plano.

---

## 📋 Ejemplo de Login

### Desde Frontend (React/JavaScript)
```javascript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    usuario: 'coord1',
    contraseña: '123456'
  })
});

const data = await response.json();
console.log(data.token); // Token JWT
console.log(data.user);  // Datos del usuario
```

### Desde Postman/Thunder Client
```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "usuario": "coord1",
  "contraseña": "123456"
}
```

### Respuesta Esperada
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "usuario": "coord1",
    "rol": "COORDINADOR",
    "nombre": "Carlos",
    "apellidoPaterno": "García",
    "apellidoMaterno": "López",
    "email": "coord1@teczamora.edu.mx",
    "estado": "activo"
  }
}
```

---

## 🌐 Uso en Azure

Este cambio funciona tanto en **localhost** como en **Azure**:

### Localhost
```
http://localhost:3001/api/auth/login
```

### Azure
```
https://tu-app.azurewebsites.net/api/auth/login
```

**Ambos ambientes comparten la misma base de datos Azure MySQL**, por lo que el cambio aplica automáticamente en ambos.

---

## ⚠️ Consideraciones de Seguridad

### En Desarrollo
✅ **Aceptable**: Las contraseñas en texto plano simplifican el testing y desarrollo.

### En Producción
⚠️ **Considerar**: Para un sistema en producción real, se recomienda:
1. Usar bcrypt para todas las contraseñas
2. Implementar políticas de contraseñas fuertes
3. Agregar autenticación de dos factores (2FA)

### Estado Actual
- Sistema funcional para desarrollo y pruebas ✅
- Facilita el proceso de login ✅
- Base de datos en Azure con contraseñas actualizadas ✅

---

## 📝 Resumen de Cambios

| Aspecto | Estado |
|---------|--------|
| Base de datos actualizada | ✅ Completado |
| Coordinadores (9) | ✅ Contraseña: 123456 |
| Directivos (3) | ✅ Contraseña: 123456 |
| AuthController compatible | ✅ Sin cambios necesarios |
| Tests de login | ✅ Todos pasaron |
| Funcionamiento en Azure | ✅ Operativo |
| Funcionamiento en localhost | ✅ Operativo |

---

## 💡 Próximos Pasos

1. **Iniciar servidor** (si no está corriendo):
   ```bash
   cd backend
   node server.js
   ```

2. **Probar login desde tu frontend**:
   - Usar coord1 / 123456
   - Usar dir1 / 123456

3. **Verificar en Azure**:
   - El cambio ya está aplicado en la base de datos Azure
   - No necesitas volver a desplegar

---

**Fecha de actualización:** 26 de enero de 2026  
**Estado:** ✅ Contraseñas actualizadas y sistema operativo
