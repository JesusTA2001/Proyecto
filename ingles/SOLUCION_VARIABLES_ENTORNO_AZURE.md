# 🔧 SOLUCIÓN: Variables de Entorno en Azure Static Web App

## 🚨 Problema Identificado

Tu aplicación en Azure Static Web Apps no tiene configuradas las variables de entorno, por lo que está usando `http://localhost:5000/api` en lugar de tu backend de Azure.

## ✅ Solución Paso a Paso

### Opción 1: Configurar en Azure Portal (RECOMENDADO)

1. **Ve a Azure Portal**: https://portal.azure.com
2. **Busca tu Static Web App** (probablemente se llama algo como `gray-beach-0cdc4470f`)
3. En el menú izquierdo, busca **"Configuration"** o **"Configuración"**
4. Click en **"Application settings"** o **"Configuración de aplicación"**
5. Click en **"+ Add"** o **"+ Agregar"**
6. Agrega esta variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://api-escolar-backend-cbgrhtfkbxgsdra9.eastus2-01.azurewebsites.net/api`
7. Click en **"Save"** o **"Guardar"**
8. Espera unos minutos para que se aplique
9. **IMPORTANTE**: Necesitas hacer un nuevo deploy para que tome efecto

### Opción 2: Configurar en el Workflow de GitHub (Alternativa)

Si la Opción 1 no funciona, edita tu workflow de GitHub Actions.

#### Paso 1: Encuentra tu workflow

Busca el archivo en: `.github/workflows/azure-static-web-apps-*.yml`

#### Paso 2: Agrega la variable de entorno

En la sección de `build`, agrega:

```yaml
- name: Build And Deploy
  id: builddeploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
    repo_token: ${{ secrets.GITHUB_TOKEN }}
    action: "upload"
    app_location: "/"
    api_location: ""
    output_location: "build"
  env:
    REACT_APP_API_URL: https://api-escolar-backend-cbgrhtfkbxgsdra9.eastus2-01.azurewebsites.net/api
```

#### Paso 3: Commit y Push

```bash
git add .github/workflows/
git commit -m "Agregar REACT_APP_API_URL al workflow de Azure"
git push origin main
```

### Opción 3: Hardcodear temporalmente (SOLO PARA PRUEBA)

**⚠️ NO RECOMENDADO PARA PRODUCCIÓN**, pero útil para confirmar que es el problema:

Edita `src/api/axios.js`:

```javascript
const api = axios.create({
  baseURL: 'https://api-escolar-backend-cbgrhtfkbxgsdra9.eastus2-01.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Haz commit y push. Si esto funciona, confirma que el problema es la variable de entorno.

## 🔍 Verificar la Configuración

Después de aplicar cualquiera de las soluciones:

1. Espera 2-3 minutos
2. Abre la consola del navegador en tu app de Azure
3. Escribe: `console.log(process.env.REACT_APP_API_URL)`
4. Debería mostrar la URL de tu backend, no `undefined`

## 📋 Checklist de Verificación

- [ ] Backend funcionando: https://api-escolar-backend-cbgrhtfkbxgsdra9.eastus2-01.azurewebsites.net/
- [ ] Variable de entorno configurada en Azure Portal
- [ ] Nuevo deploy realizado
- [ ] Frontend accediendo a la URL correcta

## 🎯 Siguiente Paso Inmediato

**Opción Rápida para Probar AHORA**:

1. Ve a `.github/workflows/` y busca tu archivo de workflow
2. Mándame el contenido completo
3. Lo editaré para agregar la variable de entorno
4. Haremos commit y push
5. En 2-3 minutos tu app debería funcionar

¿Quieres que proceda con esta solución?
