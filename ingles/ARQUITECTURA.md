# 🎯 ARQUITECTURA DE TU APLICACIÓN

## 📊 Componentes y URLs

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   FRONTEND (React)    │
         │   📱 Vercel           │
         │ proyecto-2971.vercel.app │
         └───────────┬───────────┘
                     │
                     │ fetch/axios
                     │ (peticiones HTTP)
                     ▼
         ┌───────────────────────┐
         │   BACKEND (Node.js)   │
         │   🚀 Azure App Service │
         │ TU-NOMBRE-APP.azurewebsites.net │
         └───────────┬───────────┘
                     │
                     │ MySQL2
                     │ (conexión SSL)
                     ▼
         ┌───────────────────────┐
         │   BASE DE DATOS       │
         │   🗄️  Azure MySQL     │
         │ mysqlingles.mysql.database.azure.com │
         └───────────────────────┘
```

---

## 🔧 CONFIGURACIÓN ACTUAL

### ✅ Base de Datos (YA CONFIGURADA)
- **Servicio**: Azure MySQL Flexible Server
- **Host**: `mysqlingles.mysql.database.azure.com`
- **Puerto**: `3306`
- **Usuario**: `admin_ingles`
- **Base de datos**: `proyectoingles`
- **Estado**: ✅ Funcionando (verificado con comandos mysql)

### 🎨 Frontend (YA DESPLEGADO)
- **Servicio**: Vercel
- **URL**: `https://proyecto-2971.vercel.app`
- **Framework**: React
- **Estado**: ✅ Desplegado (pero sin backend funcional)

### 🚀 Backend (PENDIENTE DE DESPLEGAR)
- **Servicio**: Azure App Service (por crear)
- **URL sugerida**: `https://proyecto-ingles-api.azurewebsites.net`
- **Framework**: Node.js + Express
- **Estado**: ⏳ Código listo, falta desplegar

---

## 📝 VARIABLES DE ENTORNO

### Backend (Azure App Service)
Estas variables se configuran en Azure Portal:

```env
DB_HOST=mysqlingles.mysql.database.azure.com
DB_USER=admin_ingles
DB_PASSWORD=Ingles123
DB_NAME=proyectoingles
DB_PORT=3306
JWT_SECRET=tu_clave_secreta_azure_2025
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=18-lts
```

### Frontend (Vercel)
Esta variable se configura en el archivo `.env.production`:

```env
REACT_APP_API_URL=https://TU-NOMBRE-APP.azurewebsites.net/api
```

⚠️ **IMPORTANTE**: Cambiar `TU-NOMBRE-APP` por el nombre real de tu Web App en Azure.

---

## 🎯 PROBLEMA ACTUAL Y SOLUCIÓN

### ❌ Problema
Tu frontend en Vercel intenta conectarse a un backend que no existe:
- Frontend: `https://proyecto-2971.vercel.app` ✅
- Backend: `https://railway.app/...` ❌ (no configurado)
- Resultado: **Error de CORS** y **ERR_NETWORK**

### ✅ Solución
1. Desplegar el backend en Azure App Service
2. Actualizar `.env.production` con la URL real del backend
3. Redesplegar el frontend en Vercel

---

## 📋 CHECKLIST DE DESPLIEGUE

### Paso 1: Azure MySQL ✅
- [x] Servidor creado: `mysqlingles.mysql.database.azure.com`
- [x] Base de datos importada: `proyectoingles`
- [x] Usuarios y datos verificados
- [x] Firewall configurado

### Paso 2: Backend en Azure App Service ⏳
- [ ] Crear Web App en Azure Portal
- [ ] Configurar 8 variables de entorno
- [ ] Habilitar "Permitir servicios de Azure" en firewall MySQL
- [ ] Conectar con GitHub para deployment automático
- [ ] Verificar que responda: `https://TU-APP.azurewebsites.net/api/test-db`

### Paso 3: Frontend en Vercel ⏳
- [ ] Actualizar `.env.production` con URL real del backend
- [ ] Hacer commit y push a GitHub
- [ ] Vercel redesplega automáticamente
- [ ] Verificar login sin errores de CORS

---

## 🚀 PRÓXIMOS PASOS (EN ORDEN)

1. **Ir a Azure Portal**: https://portal.azure.com
2. **Seguir guía**: Abrir `INICIO_RAPIDO_AZURE.md`
3. **Crear Web App**: Con Node 18 LTS, plan F1 (Free)
4. **Anotar URL**: Por ejemplo, `proyecto-ingles-api.azurewebsites.net`
5. **Configurar variables**: Las 8 variables del backend
6. **Conectar GitHub**: Para deployment automático
7. **Actualizar .env.production**: Con la URL real
8. **Commit y push**: Para activar el despliegue
9. **Verificar**: Login funcional sin errores

---

## 💡 NOTAS IMPORTANTES

### Sobre las URLs
- **NO** uses `mysqlingles.mysql.database.azure.com` en el frontend
- Esa URL es solo para que el backend se conecte a la base de datos
- El frontend usa `https://TU-APP.azurewebsites.net/api` (el backend)

### Sobre los costos
- **MySQL**: ~$12-15/mes (ya lo tienes)
- **App Service F1**: $0/mes (gratis)
- **Vercel**: $0/mes (gratis)
- **Total nuevo**: $0/mes
- **Cubierto por**: Azure for Students ($100 crédito)

### Sobre el CORS
- Ya está configurado en `backend/server.js`
- Acepta cualquier URL `*.vercel.app`
- No necesitas modificar nada más

---

## 📞 ¿Dudas?

- **¿Qué nombre poner al Web App?** Cualquiera único, por ejemplo: `proyecto-ingles-api`
- **¿En qué región?** La misma que tu MySQL: East US
- **¿Qué plan elegir?** F1 (Free) es suficiente para empezar
- **¿Cuánto tarda?** 15-20 minutos en total

---

**Siguiente paso**: Abre Azure Portal y sigue `INICIO_RAPIDO_AZURE.md` paso a paso.
