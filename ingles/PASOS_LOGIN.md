# 🚨 PASOS PARA HACER FUNCIONAR EL LOGIN

## 📊 SITUACIÓN ACTUAL

✅ **Frontend**: Desplegado y funcionando
✅ **Base de datos Azure**: Configurada y conectada
✅ **authController**: Ya modificado para contraseñas sin hashear
❌ **Backend API**: NO ARRANCA (Error 503)

---

## 🔧 PASO 1: ARREGLAR EL BACKEND (PRIORIDAD)

### En Azure Portal:
1. Ve a: App Service → **ingles**
2. Menú izquierdo → **"Log stream"**
3. **COPIA EL ERROR** que aparece y envíalo

### Comando de inicio correcto:
- Ya configuraste: `node server.js` ✅
- Archivo `.deployment` creado ✅

### Si el error dice "Cannot find module":
- El problema es la estructura de carpetas en el despliegue
- Azure no encuentra los archivos en `/home/site/wwwroot/`

---

## 🗄️ PASO 2: EJECUTAR SCRIPT SQL (DESPUÉS de arreglar backend)

### Archivo creado: `SCRIPT_LOGIN_SIMPLE.sql`

### Opción A - Desde línea de comandos:
```bash
mysql -h mysqlingles.mysql.database.azure.com -u admin_ingles -pGui11ermo1 proyectoIngles < SCRIPT_LOGIN_SIMPLE.sql
```

### Opción B - Desde MySQL Workbench:
1. Conecta a tu servidor Azure MySQL
2. Abre el archivo `SCRIPT_LOGIN_SIMPLE.sql`
3. Ejecuta el script

### Opción C - Desde Azure Portal:
1. Azure Portal → Azure Database for MySQL
2. Busca tu servidor: `mysqlingles`
3. Menú → **"Query editor"** (si está disponible)
4. Pega el contenido de `SCRIPT_LOGIN_SIMPLE.sql`
5. Ejecuta

---

## 🧪 PASO 3: PROBAR EL LOGIN

### Credenciales de prueba:
```
ADMINISTRADOR:
- Usuario: admin1
- Password: 123456

PROFESOR:
- Usuario: prof1  
- Password: 123456

ESTUDIANTE:
- Usuario: 1000
- Password: 123456
```

### Endpoint a probar:
```
POST https://ingles-axa9b4awfbf6gbfz.eastus2-01.azurewebsites.net/api/auth/login

Body (JSON):
{
  "usuario": "admin1",
  "contraseña": "123456"
}
```

---

## 🐛 DEPURACIÓN SI SIGUE SIN FUNCIONAR

### 1. Verificar backend arranca:
```
GET https://ingles-axa9b4awfbf6gbfz.eastus2-01.azurewebsites.net
```
Debería responder con:
```json
{
  "message": "API del Sistema de Gestión Escolar",
  "status": "Servidor funcionando correctamente"
}
```

### 2. Verificar conexión DB:
```
GET https://ingles-axa9b4awfbf6gbfz.eastus2-01.azurewebsites.net/api/test-db
```
Debería responder con:
```json
{
  "success": true,
  "message": "Conexión a MySQL exitosa"
}
```

### 3. Ver logs del backend:
Azure Portal → App Service → Log stream

---

## 📝 NOTAS IMPORTANTES

1. **Contraseñas sin hashear son TEMPORALES**
   - Solo para testing
   - En producción debes usar bcrypt

2. **authController ya modificado**
   - Línea 48: Comparación directa sin bcrypt
   - Ya está en tu código actual

3. **El problema principal es el BACKEND**
   - Hasta que no arranque, no sirve el SQL
   - Enfócate primero en los logs de Azure

---

## ❓ QUÉ HACER AHORA

1. **URGENTE**: Ve a Azure Log Stream y envía el error
2. Necesitamos ver por qué el backend no arranca
3. Una vez que arranque, ejecutas el SQL
4. Pruebas el login con admin1/123456

---

## 📞 SIGUIENTE PASO

**Envía el error del Log Stream de Azure**
Sin eso no podemos avanzar.
