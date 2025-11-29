# 🚀 Desplegar Backend en Azure App Service

## ✅ Tu Configuración Actual
- ✅ Base de datos: Azure MySQL (`mysqlingles.mysql.database.azure.com`)
- ✅ Frontend: Vercel (`https://proyecto-2971.vercel.app`)
- 🎯 Backend: Azure App Service (vamos a crearlo)
- 💳 Cuenta: Azure for Students ($100 crédito gratis)

---

## PASO 1: Crear Azure App Service desde el Portal

### 1.1 Acceder a Azure Portal

1. Ve a: https://portal.azure.com
2. Inicia sesión con tu cuenta de estudiante

### 1.2 Crear Web App

1. Click en **"Crear un recurso"**
2. Buscar **"Web App"** o **"App Service"**
3. Click en **"Crear"**

### 1.3 Configuración Básica

**Pestaña "Aspectos básicos":**

```
Suscripción: Azure for Students
Grupo de recursos: [Seleccionar existente] → rg-proyecto-ingles
                   [O crear nuevo con el mismo nombre]

Detalles de la instancia:
  Nombre: ingles-backend
  Publicar: Código
  Pila del entorno en tiempo de ejecución: Node 18 LTS
  Sistema operativo: Linux
  Región: East US (o la misma de tu MySQL)

Plan de precios:
  Plan de Linux (East US): [Crear nuevo]
  Nombre del plan: ASP-ingles
  SKU y tamaño: F1 (Free) - Perfecto para estudiantes
```

⚠️ **IMPORTANTE**: Anota tu URL, será:
```
https://ingles-backend.azurewebsites.net
```

### 1.4 Configuración de Deployment

**Pestaña "Implementación":**

```
Implementación continua: Habilitar
Cuenta de GitHub: [Tu cuenta]
Organización: JesusTA2001
Repositorio: Proyecto
Rama: main
```

⚠️ Si no aparece la opción de GitHub aquí, la configuraremos en el siguiente paso.

Click en **"Revisar y crear"** → **"Crear"**

⏱️ **Espera 2-3 minutos** mientras Azure crea el recurso

---

## PASO 2: Configurar Variables de Entorno

### 2.1 Ir a Configuration

1. Una vez creado, ir al recurso **"ingles-backend"**
2. En el menú izquierdo: **"Configuración"** → **"Configuration"**
3. Pestaña **"Application settings"**

### 2.2 Agregar Variables

Click en **"+ New application setting"** para cada una:

```
Nombre: DB_HOST
Valor: mysqlingles.mysql.database.azure.com

Nombre: DB_USER
Valor: admin_ingles

Nombre: DB_PASSWORD
Valor: Ingles123

Nombre: DB_NAME
Valor: proyectoingles

Nombre: DB_PORT
Valor: 3306

Nombre: JWT_SECRET
Valor: tu_clave_secreta_super_segura_azure_2025

Nombre: NODE_ENV
Valor: production

Nombre: PORT
Valor: 8080

Nombre: WEBSITE_NODE_DEFAULT_VERSION
Valor: 18-lts
```

⚠️ **IMPORTANTE**: Click en **"Guardar"** al terminar de agregar todas.

---

## PASO 3: Configurar Deployment desde GitHub

### 3.1 Opción A: Desde Azure Portal (Recomendado)

1. En tu App Service, ir a: **"Centro de implementación"** (Deployment Center)
2. Seleccionar **"GitHub"**
3. Autorizar acceso (si es primera vez)
4. Configurar:
   ```
   Organización: JesusTA2001
   Repositorio: Proyecto
   Rama: main
   ```
5. En **"Configuración de compilación"**:
   - Tipo de compilación: **GitHub Actions** (recomendado)
   - Carpeta raíz de la aplicación: `/backend`

6. Click en **"Guardar"**

Azure creará automáticamente un archivo de GitHub Actions.

### 3.2 Opción B: Configuración Manual de GitHub Actions

Si prefieres control total, puedes crear el archivo manualmente.

---

## PASO 4: Configurar Carpeta de Backend

Azure necesita saber que el código está en `/backend`. Tenemos dos opciones:

### Opción A: Configurar en Azure (Más fácil)

1. En Azure Portal → tu App Service
2. **"Configuración"** → **"General settings"**
3. En **"Startup Command"**:
   ```bash
   cd backend && npm install && node server.js
   ```

### Opción B: Usar GitHub Actions con carpeta específica

Azure creará automáticamente el workflow cuando configures el Deployment Center.

---

## PASO 5: Verificar el Firewall de MySQL

Tu Azure MySQL debe permitir conexiones desde tu App Service:

1. Ve a: Azure Portal → **"mysqlingles"** (tu servidor MySQL)
2. **"Redes"** o **"Networking"**
3. En **"Reglas de firewall"**:
   - ☑️ **"Permitir el acceso a servicios de Azure"** (HABILITAR)
   
   O agregar regla específica:
   ```
   Nombre: AllowAppService
   IP inicial: 0.0.0.0
   IP final: 0.0.0.0
   ```
   (Azure App Service usa IPs dinámicas, por eso permitimos servicios de Azure)

4. **"Guardar"**

---

## PASO 6: Verificar CORS en el Código

El código ya tiene CORS configurado correctamente en `backend/server.js`:

```javascript
const allowedOrigins = [
  'https://proyecto-2971.vercel.app',
  'http://localhost:3000',
  'https://railway.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('No permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400
}));
```

✅ Ya está configurado para aceptar cualquier dominio `.vercel.app`

---

## PASO 7: Actualizar Frontend (.env.production)

Archivo ya actualizado con:

```env
REACT_APP_API_URL=https://ingles-backend.azurewebsites.net/api
```

Pero debes cambiar `ingles-backend` por el nombre que elegiste en el Paso 1.

---

## PASO 8: Hacer Commit y Push

```powershell
cd "c:\Users\jesus\OneDrive\Escritorio\CURSOS PROGRAMACION\Proyecto Maestria\ingles"

git add .
git commit -m "Configurar backend para Azure App Service con CORS correcto"
git push origin main
```

Esto activará:
1. ✅ GitHub Actions para desplegar en Azure App Service
2. ✅ Vercel para redesplegar el frontend con la nueva URL

---

## PASO 9: Verificar el Deployment

### 9.1 Ver Logs en Azure

1. Azure Portal → tu App Service
2. **"Centro de implementación"** → Ver **"Logs"**
3. O en **"Log stream"** para ver en tiempo real

### 9.2 Probar el Backend

Espera 3-5 minutos y prueba:

```
https://ingles-backend.azurewebsites.net/
```

Deberías ver:
```json
{
  "message": "API del Sistema de Gestión Escolar",
  "status": "Servidor funcionando correctamente",
  "version": "1.0.0"
}
```

Probar conexión a DB:
```
https://ingles-backend.azurewebsites.net/api/test-db
```

Debería mostrar:
```json
{
  "success": true,
  "message": "Conexión a MySQL exitosa",
  "database": "proyectoingles"
}
```

### 9.3 Probar Login desde Vercel

1. Ir a: `https://proyecto-2971.vercel.app/login`
2. Intentar login con: `admin1` / `anapar`
3. ✅ Debería funcionar sin errores de CORS

---

## 💰 Costos con Azure for Students

Con tu cuenta de estudiante:

- ✅ **$100 USD de crédito gratis**
- ✅ **App Service F1 (Free)**: $0/mes
- 💵 **MySQL Flexible Server B1s**: ~$12-15/mes
- 📊 **Total**: ~$12-15/mes (cubierto por tu crédito)

**Duración del crédito**: ~6-8 meses con esta configuración

---

## 🔧 Troubleshooting

### Error: "Application Error"

**Ver logs:**
```powershell
# Instalar Azure CLI (si no lo tienes)
winget install Microsoft.AzureCLI

# Login
az login

# Ver logs en tiempo real
az webapp log tail --name ingles-backend --resource-group rg-proyecto-ingles
```

### Error: "Cannot find module"

El App Service necesita instalar dependencias. Verificar en **"Configuration"** → **"General settings"**:

```
Stack: Node 18 LTS
Startup Command: cd backend && npm install && node server.js
```

### Error: "Can't connect to MySQL"

1. Verificar variables de entorno en **"Configuration"**
2. Verificar firewall de MySQL (Permitir servicios de Azure)
3. Ver logs: `az webapp log tail...`

### Error de CORS persiste

Verificar en el código que `proyecto-2971.vercel.app` esté en los orígenes permitidos.

---

## 📊 Monitoreo

### Ver estadísticas

1. Azure Portal → tu App Service
2. **"Información general"** → Ver gráficos de:
   - Solicitudes
   - Tiempo de respuesta
   - Errores
   - Uso de CPU/Memoria

### Habilitar Application Insights (Opcional)

Para logs detallados y monitoreo avanzado:

1. App Service → **"Application Insights"**
2. **"Turn on Application Insights"**
3. Crear nuevo recurso (gratis con tu crédito)

---

## ✅ Checklist Final

- [ ] App Service creado en Azure
- [ ] Variables de entorno configuradas
- [ ] Firewall de MySQL permite App Service
- [ ] GitHub Actions configurado
- [ ] Frontend actualizado con nueva URL
- [ ] Commit y push realizados
- [ ] Backend responde en `https://TUAPP.azurewebsites.net`
- [ ] Login funciona desde Vercel sin errores CORS

---

## 🎯 Siguiente: Optimizaciones

Una vez que funcione:

1. **Agregar dominio personalizado** (opcional)
2. **Configurar SSL personalizado** (opcional)
3. **Habilitar Application Insights** para monitoreo
4. **Configurar slots de deployment** para staging

---

**¡Listo para empezar! Sigue los pasos en orden.** 🚀
