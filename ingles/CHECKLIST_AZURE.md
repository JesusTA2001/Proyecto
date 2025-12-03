# ✅ CHECKLIST - Despliegue Azure

## 📋 Pasos a Seguir (En orden)

### 1️⃣ Crear Backend App Service en Azure
- [ ] Ir a Azure Portal → Crear Web App
- [ ] Nombre: `proyecto-ingles-api` (o el que quieras)
- [ ] Runtime: Node 20 LTS
- [ ] Sistema operativo: Linux
- [ ] Crear recurso

### 2️⃣ Configurar GitHub Secrets para Backend

**OPCIÓN A: Con Publish Profile (Recomendado si está disponible)**
- [ ] Descargar perfil de publicación del App Service
- [ ] GitHub → Settings → Secrets → New secret
- [ ] Nombre: `AZURE_BACKEND_PUBLISH_PROFILE`
- [ ] Valor: Contenido del archivo .PublishSettings

**OPCIÓN B: Con Service Principal (Si no puedes descargar publish profile)**
- [ ] Instalar Azure CLI: `winget install Microsoft.AzureCLI`
- [ ] Login: `az login`
- [ ] Obtener Subscription ID: `az account show --query id -o tsv`
- [ ] Crear Service Principal:
```powershell
az ad sp create-for-rbac --name "github-deploy-ingles" --role contributor --scopes /subscriptions/<TU-SUBSCRIPTION-ID> --sdk-auth
```
- [ ] Copiar TODO el JSON resultante
- [ ] GitHub → Settings → Secrets → New secret
- [ ] Nombre: `AZURE_CREDENTIALS`
- [ ] Valor: Pegar el JSON completo
- [ ] ℹ️ Ver guía completa en `AZURE_CREDENTIALS_SETUP.md`

### 3️⃣ Actualizar Workflow del Backend
- [ ] Editar `.github/workflows/azure-backend-deploy.yml`
- [ ] Cambiar `AZURE_WEBAPP_NAME: 'tu-backend-app-name'` por tu nombre real

### 4️⃣ Crear Frontend Static Web App en Azure
- [ ] Azure Portal → Crear Static Web App
- [ ] Nombre: `proyecto-ingles-frontend`
- [ ] Plan: Free
- [ ] Conectar a GitHub (tu repo)
- [ ] Build Presets: React
- [ ] App location: `/`
- [ ] Output location: `build`

### 5️⃣ Configurar GitHub Secret para Frontend
- [ ] En tu Static Web App → Copiar deployment token
- [ ] GitHub → Settings → Secrets → New secret
- [ ] Nombre: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- [ ] Valor: El token copiado

### 6️⃣ Configurar Firewall de MySQL Azure
- [ ] Azure Portal → Tu MySQL Server
- [ ] Seguridad de conexión → Reglas de firewall
- [ ] Activar "Permitir el acceso a servicios de Azure"
- [ ] Guardar

### 7️⃣ Hacer Push y Desplegar
```bash
git add .
git commit -m "Configurar despliegue Azure para backend y frontend"
git push origin main
```

### 8️⃣ Verificar Despliegue del Backend
- [ ] GitHub → Actions → Verificar workflow "Deploy Backend to Azure"
- [ ] Debe estar en ✅ verde
- [ ] Copiar la URL: `https://tu-app.azurewebsites.net`

### 9️⃣ Actualizar Frontend con URL del Backend
- [ ] Editar `.env.production`
- [ ] Cambiar: `REACT_APP_API_URL=https://tu-backend-real.azurewebsites.net/api`
- [ ] Commit y push de nuevo

### 🔟 Verificar Frontend
- [ ] GitHub → Actions → Verificar workflow "Deploy Frontend to Azure"
- [ ] Visitar URL del Static Web App
- [ ] Probar login y funcionalidad

---

## 🎯 URLs Finales (Ejemplo)

- **Backend API**: https://proyecto-ingles-api.azurewebsites.net
- **Frontend**: https://proyecto-ingles-frontend.azurewebsites.net
- **Base de Datos**: mysqlingles.mysql.database.azure.com ✅

---

## ⚠️ Notas Importantes

1. **El frontend fallará primero** hasta que actualices `.env.production` con la URL real del backend
2. **Los despliegues son automáticos** después del setup inicial
3. **Cambios en backend/** solo despliegan el backend
4. **Cambios en src/** solo despliegan el frontend

---

## 🔄 Para Volver a Local

### Backend (db.js):
```javascript
// Comentar Azure, descomentar Local
```

### Workflows:
```bash
# Renombrar para desactivar
mv .github/workflows/azure-backend-deploy.yml .github/workflows/azure-backend-deploy.yml.disabled
```

---

## 📞 Ayuda Rápida

**Error en npm install**: Verifica que el workflow apunte a `backend/`
**Error de conexión DB**: Revisa firewall de Azure MySQL
**Frontend no carga datos**: Actualiza `.env.production` con URL correcta

¡Éxito con tu despliegue! 🚀
