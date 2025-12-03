# 🔧 SOLUCIÓN DEFINITIVA - Backend 404 en Azure

## El Problema
Azure NO está ejecutando tu aplicación Node.js. Está mostrando la página de bienvenida porque no encuentra el punto de entrada correcto.

## ✅ SOLUCIÓN (Hazlo AHORA en el Portal de Azure)

### Paso 1: Ir a Azure Portal
1. Abre: https://portal.azure.com
2. Busca tu App Service: **ingles**
3. Haz clic en él

### Paso 2: Configurar el Comando de Inicio
1. En el menú izquierdo, busca **"Configuration"** (Configuración)
2. Haz clic en la pestaña **"General settings"**
3. Busca el campo **"Startup Command"** (Comando de inicio)
4. Escribe exactamente: **`node server.js`**
5. Haz clic en **"Save"** (Guardar) arriba
6. Haz clic en **"Continue"** cuando pregunte si quieres reiniciar

### Paso 3: Verificar Variables de Entorno
1. En la misma pantalla "Configuration"
2. Ve a la pestaña **"Application settings"**
3. Agrega estas variables si no existen:
   - `PORT` = `8080`
   - `NODE_ENV` = `production`
4. Haz clic en **"Save"**

### Paso 4: Reiniciar App Service
1. Regresa al **"Overview"** (Información general)
2. Haz clic en **"Restart"** (Reiniciar) en la parte superior
3. Espera 1 minuto

### Paso 5: Probar
Abre en tu navegador:
```
https://ingles-axa9b4awfbf6gbfz.eastus2-01.azurewebsites.net/api/alumnos
```

Deberías ver datos JSON en lugar de 404.

## 🔍 Verificación Adicional

### Ver Logs en Vivo
1. En Azure Portal, tu App Service "ingles"
2. Menú izquierdo → **"Log stream"**
3. Deberías ver: `Servidor corriendo en puerto 8080` o similar

### Si Sigue Fallando
Verifica en **"Deployment Center"** (Centro de implementación):
- Que el último despliegue sea exitoso (check verde)
- Que la fuente sea GitHub
- Que apunte a la rama `main`

## 📝 Notas Importantes
- Azure necesita el comando de inicio explícito porque tu `package.json` puede no ser reconocido
- El `web.config` que creamos ayuda, pero el Startup Command es CRÍTICO
- Azure usa el puerto 8080 por defecto, tu app debe escuchar en `process.env.PORT`

## ⚙️ Verificar server.js
Tu archivo `backend/server.js` debe tener:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

**IMPORTANTE**: Azure inyecta la variable `PORT` automáticamente. Tu app DEBE usar `process.env.PORT`.
