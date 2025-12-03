# 🔐 Configurar Credenciales de Azure (Sin Publish Profile)

## Método: Service Principal con Azure CLI

### Paso 1: Instalar Azure CLI (si no lo tienes)

Descarga desde: https://learn.microsoft.com/cli/azure/install-azure-cli-windows

O con PowerShell:
```powershell
winget install Microsoft.AzureCLI
```

### Paso 2: Login en Azure

```powershell
az login
```

Se abrirá tu navegador para autenticarte.

### Paso 3: Obtener tu Subscription ID

```powershell
az account show --query id -o tsv
```

Copia el ID que aparece (algo como: `12345678-1234-1234-1234-123456789012`)

### Paso 4: Crear Service Principal

Reemplaza `<SUBSCRIPTION_ID>` con tu ID real:

```powershell
az ad sp create-for-rbac --name "github-deploy-ingles" --role contributor --scopes /subscriptions/<SUBSCRIPTION_ID> --sdk-auth
```

**Ejemplo:**
```powershell
az ad sp create-for-rbac --name "github-deploy-ingles" --role contributor --scopes /subscriptions/12345678-1234-1234-1234-123456789012 --sdk-auth
```

### Paso 5: Copiar el JSON Resultante

El comando anterior mostrará un JSON como este:

```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

⚠️ **IMPORTANTE**: Copia TODO el JSON completo

### Paso 6: Agregar Secret en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**
4. Configuración:
   - **Name**: `AZURE_CREDENTIALS`
   - **Value**: Pega el JSON completo que copiaste
5. **Add secret**

### Paso 7: Verificar el Workflow

El archivo `.github/workflows/azure-backend-deploy.yml` ya está configurado para usar este método (Opción 2).

---

## ✅ Resumen de Secrets Necesarios en GitHub

Para que funcione todo, necesitas estos 2 secrets:

### Backend:
- **`AZURE_CREDENTIALS`** - El JSON del Service Principal

### Frontend:
- **`AZURE_STATIC_WEB_APPS_API_TOKEN`** - Lo obtienes del Static Web App en Azure Portal

---

## 🔄 Si Quieres Volver al Método de Publish Profile

Si después consigues descargar el publish profile, puedes volver a usarlo:

1. En `.github/workflows/azure-backend-deploy.yml`:
   - Comenta la "OPCIÓN 2" (líneas con Azure CLI)
   - Descomenta la "OPCIÓN 1" (líneas con publish-profile)

2. Agrega el secret `AZURE_BACKEND_PUBLISH_PROFILE` en GitHub

---

## 🆘 Troubleshooting

### Error: "az command not found"
- Reinicia PowerShell después de instalar Azure CLI
- O cierra y abre VS Code

### Error: "Insufficient privileges"
- Necesitas ser Owner o Contributor de la suscripción de Azure
- Contacta al administrador de tu cuenta Azure

### Error: "Resource not found"
- Verifica que el SUBSCRIPTION_ID sea correcto
- Ejecuta `az account list` para ver todas tus suscripciones

---

## 🎯 Verificación Final

Ejecuta esto para confirmar que tienes acceso:

```powershell
# Ver tu suscripción activa
az account show

# Ver tus App Services
az webapp list --output table
```

Si ves tus recursos, ¡estás listo! 🚀
