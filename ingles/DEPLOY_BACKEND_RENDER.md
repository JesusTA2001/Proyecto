# 🚀 Desplegar Backend en Render (GRATIS) conectado a Azure MySQL

## ¿Por qué Render?
- ✅ 100% GRATIS (con límites razonables)
- ✅ Fácil de configurar
- ✅ Se conecta sin problemas a Azure MySQL
- ✅ Deploy automático desde GitHub

---

## PASO 1: Preparar el Repositorio

### 1.1 Crear archivo de variables de entorno para producción

Ya tienes `backend/.env.example` - perfecto.

### 1.2 Verificar que el código esté en GitHub

Tu repo: `https://github.com/JesusTA2001/Proyecto`

---

## PASO 2: Crear cuenta en Render

1. Ve a: https://render.com
2. Click en **"Get Started"**
3. Conecta con tu cuenta de GitHub
4. Autoriza el acceso a tus repositorios

---

## PASO 3: Crear Web Service

1. En el Dashboard de Render, click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio: **JesusTA2001/Proyecto**
3. Configurar:

```
Name: ingles-backend
Region: Oregon (US West) - Es gratis
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

---

## PASO 4: Configurar Variables de Entorno

En la sección **"Environment Variables"**, agregar:

```
DB_HOST=mysqlingles.mysql.database.azure.com
DB_USER=admin_ingles
DB_PASSWORD=Ingles123
DB_NAME=proyectoingles
DB_PORT=3306
JWT_SECRET=tu_clave_secreta_super_segura_2024
PORT=10000
NODE_ENV=production
```

⚠️ **IMPORTANTE**: Render usa el puerto 10000 internamente.

---

## PASO 5: Configurar Plan

- Instance Type: **Free** (seleccionar este)
- Auto-Deploy: **Yes** (para deploy automático cuando hagas push)

Click en **"Create Web Service"**

⏱️ **Espera 2-5 minutos** - Render desplegará tu backend

---

## PASO 6: Obtener URL del Backend

Una vez desplegado, Render te dará una URL como:
```
https://ingles-backend.onrender.com
```

Esta es tu **URL del backend** para usar en el frontend.

---

## PASO 7: Configurar Firewall de Azure MySQL

Tu Azure MySQL debe permitir conexiones desde Render:

1. Ve a Azure Portal
2. Tu MySQL Server → **"Redes"** → **"Reglas de firewall"**
3. Agregar regla:
   ```
   Nombre: AllowRender
   IP inicial: 0.0.0.0
   IP final: 255.255.255.255
   ```
   
⚠️ **Nota**: En producción real, deberías usar IPs específicas de Render.

O más seguro, habilitar:
- ☑️ **"Permitir el acceso desde servicios de Azure"**

---

## PASO 8: Actualizar Frontend en Vercel

1. En tu proyecto local, actualizar `.env.production`:

```env
REACT_APP_API_URL=https://ingles-backend.onrender.com/api
```

2. Hacer commit y push:

```powershell
git add .
git commit -m "Actualizar URL del backend para Render"
git push
```

3. Vercel se redesplegará automáticamente

---

## PASO 9: Verificar que Funcione

1. Abrir: `https://ingles-backend.onrender.com/`
   - Deberías ver: `{"message":"API del Sistema de Gestión Escolar"}`

2. Probar DB: `https://ingles-backend.onrender.com/api/test-db`
   - Debería mostrar: `{"success":true,"message":"Conexión a MySQL exitosa"}`

3. Abrir tu app en Vercel: `https://proyecto-2971.vercel.app/login`
   - Hacer login con `admin1` / `anapar`
   - ✅ Debería funcionar sin errores de CORS

---

## 🔥 Limitaciones del Plan Gratis de Render

- ⏱️ El servicio "duerme" después de 15 minutos de inactividad
- 🐌 Primera petición después de dormir tarda ~30-60 segundos
- 💾 750 horas/mes (suficiente para desarrollo/demos)

**Para evitar que duerma:**
- Upgrade a plan pagado ($7/mes)
- Usar servicio de "ping" para mantenerlo activo

---

## ✅ Ventajas de esta Configuración

✅ Backend GRATIS en Render  
✅ Frontend GRATIS en Vercel  
✅ Base de datos en Azure MySQL (pagada pero centralizada)  
✅ Deploy automático desde GitHub  
✅ CORS configurado correctamente  
✅ SSL/HTTPS incluido  

---

## 🆘 Troubleshooting

### Error: "Application failed to respond"
- Verificar logs en Render Dashboard
- Verificar que el puerto sea 10000
- Revisar variables de entorno

### Error: "Can't connect to MySQL"
- Verificar firewall de Azure MySQL
- Verificar credenciales en variables de entorno
- Revisar logs de Render

### Error de CORS
- El código ya tiene CORS configurado para Vercel
- Verificar que la URL en `.env.production` sea correcta

---

## 🎯 ¿Listo para empezar?

Dime si quieres que te ayude con los pasos específicos o si prefieres otra opción.

