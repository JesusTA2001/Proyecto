# ⚡ GUÍA RÁPIDA: Despliegue en Azure App Service

## 🎯 PASOS RÁPIDOS (15 minutos)

### 1️⃣ CREAR WEB APP EN AZURE (5 min)

```
https://portal.azure.com
→ "Crear un recurso"
→ Buscar "Web App"
→ Configurar:
   • Nombre: proyecto-ingles-api (u otro nombre único disponible)
   • Publicar: Código
   • Runtime: Node 18 LTS
   • OS: Linux
   • Región: East US (misma región que tu MySQL: mysqlingles)
   • Plan: F1 (Free)
→ Crear
```

**Tu URL será**: `https://proyecto-ingles-api.azurewebsites.net`
(Anota este nombre exacto, lo necesitarás para el frontend)

⚠️ **IMPORTANTE**: El nombre debe ser único en todo Azure. Si "proyecto-ingles-api" ya existe, prueba con:
- `ingles-api-2025`
- `sistema-ingles-api`
- `tu-nombre-ingles-api`

---

### 2️⃣ CONFIGURAR VARIABLES DE ENTORNO (3 min)

```
Azure Portal → tu Web App
→ "Configuración" (Settings)
→ "Configuration"
→ "Application settings"
→ "+ New application setting"
```

**Agregar estas 8 variables:**

| Nombre | Valor |
|--------|-------|
| `DB_HOST` | `mysqlingles.mysql.database.azure.com` |
| `DB_USER` | `admin_ingles` |
| `DB_PASSWORD` | `Ingles123` |
| `DB_NAME` | `proyectoingles` |
| `DB_PORT` | `3306` |
| `JWT_SECRET` | `tu_clave_secreta_azure_2025` |
| `NODE_ENV` | `production` |
| `WEBSITE_NODE_DEFAULT_VERSION` | `18-lts` |

**¡IMPORTANTE!** → Click "Guardar" arriba

---

### 3️⃣ HABILITAR ACCESO DESDE APP SERVICE A MYSQL (2 min)

```
Azure Portal
→ Buscar "mysqlingles"
→ "Redes" (Networking)
→ ☑️ "Permitir el acceso a servicios de Azure"
→ Guardar
```

---

### 4️⃣ CONFIGURAR GITHUB DEPLOYMENT (3 min)

```
Azure Portal → tu Web App
→ "Centro de implementación" (Deployment Center)
→ Origen: "GitHub"
→ Autorizar (si es primera vez)
→ Configurar:
   • Organización: JesusTA2001
   • Repositorio: Proyecto
   • Rama: main
→ Guardar
```

Azure creará automáticamente un workflow de GitHub Actions.

---

### 5️⃣ ACTUALIZAR URL EN EL FRONTEND (2 min)

**En VS Code**, abre `.env.production` y cambia:

```env
REACT_APP_API_URL=https://TU-NOMBRE-APP.azurewebsites.net/api
```

Reemplaza `TU-NOMBRE-APP` con el nombre que elegiste en el paso 1.

**Ejemplo:** Si nombraste tu app "ingles-backend":
```env
REACT_APP_API_URL=https://ingles-backend.azurewebsites.net/api
```

---

### 6️⃣ COMMIT Y PUSH (1 min)

```powershell
git add .
git commit -m "Deploy backend a Azure App Service"
git push origin main
```

Esto activará:
- ✅ GitHub Actions → Deploy en Azure
- ✅ Vercel → Redespliegue del frontend

---

### 7️⃣ VERIFICAR (5 min)

**Espera 3-5 minutos**, luego verifica:

#### A) Backend funciona:
```
https://TU-NOMBRE-APP.azurewebsites.net/
```
Debes ver:
```json
{
  "message": "API del Sistema de Gestión Escolar",
  "status": "Servidor funcionando correctamente"
}
```

#### B) Base de datos conectada:
```
https://TU-NOMBRE-APP.azurewebsites.net/api/test-db
```
Debes ver:
```json
{
  "success": true,
  "message": "Conexión a MySQL exitosa"
}
```

#### C) Login funciona sin CORS:
```
https://proyecto-2971.vercel.app/login
```
- Usuario: `admin1`
- Contraseña: `anapar`
- ✅ Debe entrar sin errores

---

## 🚨 SI ALGO FALLA

### Ver logs en tiempo real:

```
Azure Portal → tu Web App
→ "Log stream"
```

O desde PowerShell:
```powershell
# Instalar Azure CLI (solo primera vez)
winget install Microsoft.AzureCLI

# Login
az login

# Ver logs
az webapp log tail --name TU-NOMBRE-APP --resource-group rg-proyecto-ingles
```

### Problemas comunes:

**Error 500**: Verificar variables de entorno
**Error de módulos**: Azure instalará dependencias automáticamente, esperar 5 min
**CORS**: El código ya está configurado, verificar que pusiste la URL correcta en `.env.production`

---

## 💰 COSTOS

Con Azure for Students:
- ✅ Plan F1 (Free): $0/mes
- 💵 MySQL B1s: ~$12-15/mes
- 🎓 Crédito: $100 gratis = ~6-8 meses

---

## ✅ CHECKLIST

- [ ] Web App creada en Azure
- [ ] 8 variables de entorno agregadas y guardadas
- [ ] Firewall MySQL permite servicios de Azure
- [ ] GitHub Deployment configurado
- [ ] `.env.production` actualizado con tu URL
- [ ] Commit y push realizados
- [ ] Backend responde en `https://TU-APP.azurewebsites.net`
- [ ] Login funciona desde Vercel

---

**¡Todo listo! Comienza con el Paso 1 en Azure Portal.**
