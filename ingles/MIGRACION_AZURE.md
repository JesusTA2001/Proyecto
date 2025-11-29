# 🚀 Guía de Migración a Azure Database for MySQL

## 📋 Requisitos Previos

- [x] Cuenta de Azure activa (https://portal.azure.com)
- [x] MySQL Client instalado localmente
- [x] Acceso a tu base de datos local

---

## PASO 1: Crear Azure Database for MySQL

### 1.1 Acceder a Azure Portal
1. Ir a https://portal.azure.com
2. Iniciar sesión con tu cuenta Microsoft

### 1.2 Crear el Servicio
1. Click en **"Crear un recurso"**
2. Buscar **"Azure Database for MySQL"**
3. Seleccionar **"Azure Database for MySQL flexible server"**
4. Click en **"Crear"**

### 1.3 Configuración Básica

**Pestaña "Básicos":**
```
Suscripción: [Tu suscripción de Azure]
Grupo de recursos: [Crear nuevo] → "rg-proyecto-ingles"
Nombre del servidor: proyecto-ingles-mysql
Región: East US (o la más cercana)
Versión de MySQL: 8.0
Tipo de carga de trabajo: Development (más económico)
Proceso y almacenamiento: 
  - Nivel: Burstable, B1s (1 vCore, 1 GiB RAM)
  - Almacenamiento: 20 GiB
  - Copias de seguridad: 7 días
```

**Pestaña "Autenticación":**
```
Método de autenticación: Solo autenticación de MySQL
Nombre de usuario administrador: adminuser
Contraseña: [Crea una contraseña segura, ej: Admin@2025Ingles]
Confirmar contraseña: [Repetir contraseña]
```

**⚠️ IMPORTANTE: Anota estas credenciales:**
```
Servidor: proyecto-ingles-mysql.mysql.database.azure.com
Usuario: adminuser
Contraseña: [Tu contraseña]
Puerto: 3306
```

### 1.4 Configuración de Red

**Pestaña "Redes":**
```
Conectividad: 
  ☑️ Acceso público (todas las redes)
  
Reglas de firewall:
  ☑️ Agregar dirección IP del cliente actual
  ☑️ Permitir el acceso desde servicios de Azure
```

Click en **"Revisar y crear"** → **"Crear"**

⏱️ **Espera 5-10 minutos** mientras Azure provisiona el servidor

---

## PASO 2: Exportar Base de Datos Local

### 2.1 Ejecutar Script de Exportación

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd "c:\Users\jesus\OneDrive\Escritorio\CURSOS PROGRAMACION\Proyecto Maestria\ingles\backend\scripts"
.\exportar_db_para_azure.bat
```

Esto creará el archivo: `proyectoingles_backup.sql`

### 2.2 Verificar Backup (Opcional)

```powershell
# Ver tamaño del archivo
ls proyectoingles_backup.sql

# Ver primeras líneas
Get-Content proyectoingles_backup.sql -Head 20
```

---

## PASO 3: Configurar Firewall en Azure

### 3.1 Obtener tu IP Actual

```powershell
# En PowerShell
(Invoke-WebRequest -Uri "https://api.ipify.org").Content
```

### 3.2 Agregar Regla de Firewall

1. En Azure Portal, ir al recurso creado
2. En el menú izquierdo: **"Redes"**
3. Click en **"+ Agregar dirección IP del cliente actual"**
4. Guardar cambios

---

## PASO 4: Importar Datos a Azure MySQL

### 4.1 Conectar a Azure desde Local

```powershell
# Probar conexión (cambiar valores con tus credenciales)
mysql -h proyecto-ingles-mysql.mysql.database.azure.com `
      -P 3306 `
      -u adminuser `
      --ssl-mode=REQUIRED `
      -p
```

Cuando te pida la contraseña, ingresa la que configuraste en Azure.

### 4.2 Importar el Backup

```powershell
# Desde la carpeta donde está proyectoingles_backup.sql
mysql -h proyecto-ingles-mysql.mysql.database.azure.com `
      -P 3306 `
      -u adminuser `
      --ssl-mode=REQUIRED `
      -p < proyectoingles_backup.sql
```

⏱️ **Espera 1-5 minutos** dependiendo del tamaño de tu base de datos

### 4.3 Verificar Importación

```sql
-- Conectar nuevamente
mysql -h proyecto-ingles-mysql.mysql.database.azure.com -P 3306 -u adminuser --ssl-mode=REQUIRED -p

-- Verificar base de datos
SHOW DATABASES;
USE proyectoingles;
SHOW TABLES;

-- Verificar datos
SELECT COUNT(*) FROM Usuarios;
SELECT COUNT(*) FROM Estudiante;
SELECT COUNT(*) FROM Profesor;

-- Salir
EXIT;
```

---

## PASO 5: Actualizar Configuración del Backend

### 5.1 Crear/Actualizar archivo `.env`

Ubicación: `backend/.env`

```env
# Azure MySQL Configuration
DB_HOST=proyecto-ingles-mysql.mysql.database.azure.com
DB_USER=adminuser
DB_PASSWORD=Admin@2025Ingles
DB_NAME=proyectoingles
DB_PORT=3306

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_clave_secreta_super_segura_2025

# Server Port
PORT=5000

# SSL Configuration for Azure
DB_SSL_MODE=REQUIRED
```

### 5.2 Actualizar código de conexión (si es necesario)

Archivo: `backend/config/db.js`

Verificar que tenga configuración SSL:

```javascript
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST.includes('azure.com') ? {
    rejectUnauthorized: false
  } : false
});
```

---

## PASO 6: Probar la Conexión

### 6.1 Iniciar Backend

```powershell
cd backend
node server.js
```

Deberías ver:
```
✅ Conexión a MySQL exitosa
🚀 Servidor corriendo en http://localhost:5000
```

### 6.2 Probar Login

```powershell
# En otro terminal
cd backend/scripts
node test_login.js
```

Debería mostrar:
```
✅ Login exitoso!
```

---

## 📊 Costos Estimados de Azure

**Configuración Development (B1s):**
- 💰 Costo aproximado: **$12-15 USD/mes**
- 📦 Incluye: 1 vCore, 1 GiB RAM, 20 GiB almacenamiento
- 🔄 Backups automáticos: 7 días

**Opciones para estudiantes:**
- 🎓 Azure for Students: $100 crédito gratis (sin tarjeta)
- 🆓 Free Trial: $200 crédito por 30 días

---

## 🔧 Troubleshooting

### Error: "Access denied for user"
- Verificar credenciales en `.env`
- Verificar que el usuario sea `adminuser@proyecto-ingles-mysql`

### Error: "SSL connection error"
- Agregar `--ssl-mode=REQUIRED` al comando mysql
- Verificar configuración SSL en `db.js`

### Error: "Can't connect to MySQL server"
- Verificar reglas de firewall en Azure Portal
- Agregar tu IP actual
- Habilitar "Permitir servicios de Azure"

### Error: "Too many connections"
- Reducir `connectionLimit` en `db.js` a 5
- Considerar upgrade a tier superior

---

## ✅ Checklist Post-Migración

- [ ] Backup local guardado en lugar seguro
- [ ] Conexión desde backend funcional
- [ ] Login de usuarios funcionando
- [ ] Datos de estudiantes visibles
- [ ] Asistencias cargando correctamente
- [ ] Calificaciones mostrando datos
- [ ] Variables de entorno en `.gitignore`
- [ ] Documentar credenciales de forma segura

---

## 🚀 Siguiente Paso: Deploy en Producción

Una vez que Azure MySQL funcione localmente:

1. **Backend**: Deploy en Railway/Render con variables de entorno de Azure
2. **Frontend**: Actualizar `src/api/axios.js` con URL del backend en producción
3. **Vercel**: Deploy del frontend apuntando al backend en la nube

---

## 📞 Soporte

Si encuentras problemas:
1. Verificar logs del backend: `node server.js`
2. Revisar Azure Portal → Logs de diagnóstico
3. Verificar conectividad: `ping proyecto-ingles-mysql.mysql.database.azure.com`

---

**¡Migración completada!** 🎉
