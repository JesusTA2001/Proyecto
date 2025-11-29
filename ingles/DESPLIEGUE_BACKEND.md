# 🚀 DESPLIEGUE DEL BACKEND EN RAILWAY

## Paso 1: Crear cuenta en Railway

1. Ve a: https://railway.app
2. Click en **"Start a New Project"**
3. Conecta con GitHub
4. Autoriza acceso a tus repositorios

## Paso 2: Deploy desde GitHub

1. En Railway, click en **"Deploy from GitHub repo"**
2. Selecciona tu repositorio: **JesusTA2001/Proyecto**
3. Railway detectará automáticamente que es Node.js

## Paso 3: Configurar Variables de Entorno

En Railway, ve a **Variables** y agrega:

```
DB_HOST=mysqlingles.mysql.database.azure.com
DB_USER=admin_ingles
DB_PASSWORD=Ingles123
DB_NAME=proyectoingles
DB_PORT=3306
JWT_SECRET=tu_clave_secreta_super_segura_2024
PORT=5000
NODE_ENV=production
```

## Paso 4: Configurar el Build

En **Settings** → **Deploy**:
- **Root Directory**: `/backend`
- **Start Command**: `node server.js`
- **Build Command**: (dejar vacío)

## Paso 5: Deploy

Railway desplegará automáticamente. Te dará una URL como:
`https://tu-proyecto-production.up.railway.app`

## Paso 6: Configurar Vercel

Una vez que tengas la URL de Railway:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:
   - Name: `REACT_APP_API_URL`
   - Value: `https://tu-proyecto-production.up.railway.app/api`
4. **Redeploy** el proyecto

## Paso 7: Verificar

1. Abre: `https://tu-proyecto-production.up.railway.app/api/test-db`
2. Deberías ver: `{"success":true,"message":"Conexión a MySQL exitosa"}`

---

## Alternativa: Deploy en Azure App Service

Si prefieres mantener todo en Azure:

### 1. Crear Web App
```bash
az webapp create --name ingles-backend --resource-group rg-proyecto-ingles --plan myPlan --runtime "NODE:18-lts"
```

### 2. Configurar Variables
En Azure Portal → Web App → Configuration → Application settings

### 3. Deploy
Puedes usar GitHub Actions o Azure CLI

---

## Problemas Comunes

### Error de CORS
Si ves error de CORS, agrega en `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://proyecto-2971.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Error de Conexión a MySQL
Verifica que las reglas de firewall de Azure MySQL permitan conexiones desde Railway.

---

**¿Prefieres Railway o Azure App Service?**
