# Guía de Despliegue en Azure

## 📋 Requisitos Previos

1. Cuenta de Azure activa
2. Azure CLI instalado (opcional)
3. Repositorio en GitHub
4. Base de datos MySQL en Azure (✅ Ya configurada)

## 🎯 Arquitectura del Despliegue

Este proyecto se despliega en **2 servicios separados** en Azure:

1. **Backend (API)** → Azure App Service (Node.js)
2. **Frontend (React)** → Azure Static Web Apps

---

## 🔧 Paso 1: Configurar Backend en Azure App Service

### 1.1 Crear App Service en Azure Portal

1. Ve a [Azure Portal](https://portal.azure.com)
2. **Crear recurso** → **Web App**
3. Configuración:
   - **Nombre**: `proyecto-ingles-api` (o el que prefieras)
   - **Publicar**: Código
   - **Pila del entorno de ejecución**: Node 20 LTS
   - **Sistema operativo**: Linux
   - **Región**: La misma que tu base de datos MySQL
   - **Plan**: Básico B1 o el que prefieras

4. **Revisar y crear**

### 1.2 Obtener el perfil de publicación

1. En tu App Service creado, ve a **Descargar perfil de publicación**
2. Se descargará un archivo `.PublishSettings`
3. Abre el archivo y copia TODO el contenido

### 1.3 Configurar secreto en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**:
   - **Name**: `AZURE_BACKEND_PUBLISH_PROFILE`
   - **Value**: Pega el contenido del archivo .PublishSettings
4. **Add secret**

### 1.4 Actualizar nombre del App Service

Edita el archivo `.github/workflows/azure-backend-deploy.yml`:
```yaml
env:
  AZURE_WEBAPP_NAME: 'proyecto-ingles-api'  # ← Cambia por tu nombre
```

---

## 🌐 Paso 2: Configurar Frontend en Azure Static Web Apps

### 2.1 Crear Static Web App en Azure Portal

1. **Crear recurso** → **Static Web App**
2. Configuración:
   - **Nombre**: `proyecto-ingles-frontend`
   - **Plan de hospedaje**: Free
   - **Región**: La más cercana
   - **Detalles de implementación**:
     - **Origen**: GitHub
     - **Repositorio**: Tu repositorio
     - **Rama**: main
     - **Ubicación de la aplicación**: `/`
     - **Ubicación de la salida**: `build`

3. **Revisar y crear**

### 2.2 Obtener el token de despliegue

1. En tu Static Web App creado, ve a **Información general**
2. Busca **Manage deployment token** → Copiar token
3. Ve a GitHub → **Settings** → **Secrets and variables** → **Actions**
4. **New repository secret**:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: Pega el token
5. **Add secret**

---

## 🔐 Paso 3: Configurar Variables de Entorno

### 3.1 Backend (App Service)

1. En tu App Service → **Configuración** → **Configuración de la aplicación**
2. Agregar estas variables (ya están en tu código, solo confirmar):
   - La conexión a DB ya está hardcodeada en `backend/config/db.js`
   - ✅ No necesitas agregar variables por ahora

### 3.2 Frontend (Static Web App)

Necesitas crear un archivo `.env.production` en la raíz:

**IMPORTANTE**: Después del primer despliegue del backend, Azure te dará una URL como:
`https://proyecto-ingles-api.azurewebsites.net`

Entonces actualiza `.env.production` con:
```
REACT_APP_API_URL=https://proyecto-ingles-api.azurewebsites.net/api
```

---

## 🚀 Paso 4: Desplegar

### 4.1 Primera vez - Deployment Manual

1. **Commit y push** de los archivos nuevos:
```bash
git add .
git commit -m "Configurar despliegue en Azure"
git push origin main
```

2. Ve a **GitHub** → **Actions**
3. Verás 2 workflows ejecutándose:
   - ✅ Deploy Backend to Azure
   - ✅ Deploy Frontend to Azure

### 4.2 Despliegues Automáticos

De ahora en adelante:
- **Cambios en `backend/**`** → Despliega solo el backend
- **Cambios en `src/**` o `public/**`** → Despliega solo el frontend
- Ambos se despliegan automáticamente al hacer push a `main`

---

## ✅ Verificar Despliegue

### Backend API
Visita: `https://proyecto-ingles-api.azurewebsites.net/api/auth/test`
Deberías ver respuesta del servidor

### Frontend
Visita: `https://proyecto-ingles-frontend.azurewebsites.net`
Deberías ver tu aplicación React

---

## 🔄 Revertir a Local (Si algo falla)

### Revertir Backend a DB Local:

Edita `backend/config/db.js` y comenta Azure, descomenta local:

```javascript
// ============================================
// CONEXIÓN LOCAL (ACTIVA)
// ============================================
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proyectoingles',
  // ...
});

// ============================================
// CONEXIÓN AZURE (COMENTADA)
// ============================================
// const pool = mysql.createPool({
//   host: 'mysqlingles.mysql.database.azure.com',
//   ...
// });
```

### Desactivar Auto-Despliegue:

Renombra los archivos de workflow:
```bash
mv .github/workflows/azure-backend-deploy.yml .github/workflows/azure-backend-deploy.yml.disabled
mv .github/workflows/azure-frontend-deploy.yml .github/workflows/azure-frontend-deploy.yml.disabled
```

---

## 📝 Notas Importantes

1. **Primera vez**: El frontend fallará hasta que actualices `.env.production` con la URL del backend desplegado
2. **CORS**: Ya está configurado en tu backend (`backend/server.js`)
3. **SSL**: Azure maneja automáticamente los certificados HTTPS
4. **Costos**: 
   - Static Web App (Frontend): GRATIS hasta 100GB/mes
   - App Service B1 (Backend): ~$13 USD/mes
   - MySQL Azure: Según tu plan actual

---

## 🆘 Troubleshooting

### Error: "npm install failed"
- Verifica que `AZURE_WEBAPP_PACKAGE_PATH: 'backend'` esté correcto
- Confirma que `backend/package.json` existe

### Error: "Connection refused" en frontend
- Actualiza `REACT_APP_API_URL` en `.env.production`
- Verifica que el backend esté corriendo en Azure

### Error: "Database connection failed"
- Verifica firewall de Azure MySQL (debe permitir servicios de Azure)
- Confirma credenciales en `backend/config/db.js`

---

## 📞 Resumen de URLs

Una vez desplegado, tendrás:

- **Backend API**: `https://proyecto-ingles-api.azurewebsites.net`
- **Frontend**: `https://proyecto-ingles-frontend.azurewebsites.net`
- **Base de Datos**: `mysqlingles.mysql.database.azure.com`

¡Todo funcionando en la nube! 🎉
