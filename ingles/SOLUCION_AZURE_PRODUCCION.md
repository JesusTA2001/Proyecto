# 🔧 SOLUCIÓN: Backend no funciona en Azure

## 📋 Problema Identificado

El backend devuelve **503 (Servidor no disponible)** en Azure porque:
1. No puede conectarse a Azure MySQL desde App Service
2. El servidor crashea al intentar iniciar sin conexión a BD

## ✅ PASOS PARA SOLUCIONAR

### 1️⃣ Configurar Firewall de Azure MySQL

1. Ve a **Azure Portal** (https://portal.azure.com)
2. Busca tu servidor MySQL: `mysqlingles`
3. En el menú izquierdo, ve a **Networking** o **Firewalls and virtual networks**
4. **IMPORTANTE:** Asegúrate de tener estas reglas:
   - ✅ **Allow Azure services**: ACTIVADO
   - ✅ Agrega la IP pública de tu App Service (o mejor aún, selecciona "Allow access to Azure services")

### 2️⃣ Verificar Variables de Entorno en App Service

1. Ve a tu **App Service**: `api-escolar-backend-cbgrhtfkbxgsdra9`
2. En el menú izquierdo: **Configuration** → **Application settings**
3. **Verifica** que tengas estas variables configuradas:

```
DB_HOST=mysqlingles.mysql.database.azure.com
DB_USER=admin_ingles
DB_PASSWORD=Gui11ermo1
DB_NAME=proyectoIngles
DB_PORT=3306
JWT_SECRET=tu_clave_secreta_super_segura_2024
NODE_ENV=production
```

4. Si NO existen, **agrégalas** haciendo clic en "+ New application setting"
5. Haz clic en **Save** (arriba)
6. **Restart** el App Service

### 3️⃣ Eliminar Carpeta Duplicada y Redesplegar

Ejecuta estos comandos en PowerShell:

```powershell
# 1. Ir al repositorio API-AZURE
cd "c:\Users\jesus\OneDrive\Escritorio\CURSOS PROGRAMACION\API-AZURE"

# 2. Eliminar carpeta backend duplicada
Remove-Item -Path "backend" -Recurse -Force

# 3. Hacer commit
git add .
git commit -m "Fix: Eliminar carpeta backend duplicada para deployment limpio"

# 4. Push a GitHub (esto triggerea el deployment automático)
git push origin master
```

### 4️⃣ Monitorear el Deployment

1. Ve a tu **App Service** en Azure Portal
2. Menú izquierdo: **Deployment Center**
3. Verás el nuevo deployment en progreso
4. Espera 2-3 minutos (NO 6 horas)
5. Revisa los **Logs** haciendo clic en el deployment

### 5️⃣ Ver Logs en Tiempo Real (IMPORTANTE)

Para ver por qué falla el servidor:

1. En **App Service** → **Log stream** (menú izquierdo)
2. O usa este comando en PowerShell:

```powershell
# Ver logs del App Service
az webapp log tail --name api-escolar-backend-cbgrhtfkbxgsdra9 --resource-group <tu-resource-group>
```

Los logs te dirán el error exacto (probablemente "Error al conectar con MySQL").

## 🎯 CAUSA RAÍZ

El problema **NO es el código** (los controllers están correctos). El problema es:

1. **Firewall de Azure MySQL** bloqueando conexiones desde App Service
2. **Variables de entorno** no configuradas en Azure App Service
3. Sin conexión a BD, el servidor crashea al iniciar → 503 error

## ✨ Después de Aplicar la Solución

Una vez configuradas las variables y el firewall:

1. El deployment será rápido (1-2 minutos, como antes)
2. El backend responderá correctamente
3. El frontend podrá cargar datos desde Azure MySQL

## 📞 Verificación Final

Prueba estos endpoints:

```bash
# 1. Verificar que el servidor responde
https://api-escolar-backend-cbgrhtfkbxgsdra9.eastus2-01.azurewebsites.net/

# 2. Verificar conexión a BD
https://api-escolar-backend-cbgrhtfkbxgsdra9.eastus2-01.azurewebsites.net/api/test-db

# 3. Verificar login
POST https://api-escolar-backend-cbgrhtfkbxgsdra9.eastus2-01.azurewebsites.net/api/auth/login
Body: {"usuario": "admin1", "contraseña": "123456"}
```

## 🔍 Notas Adicionales

- El código local funciona porque TU IP está en el firewall de MySQL
- Azure App Service usa IPs dinámicas, por eso "Allow Azure services" es necesario
- Las variables de entorno en Azure son SEPARADAS del archivo `.env` local
