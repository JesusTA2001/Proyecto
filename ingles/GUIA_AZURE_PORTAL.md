# 🎯 GUÍA VISUAL - Configurar Startup Command en Azure

## 📍 PASO A PASO (Sigue EXACTAMENTE esto)

### 1. En Azure Portal
Estás en: https://portal.azure.com
Abre tu App Service: **ingles**

### 2. MENÚ LATERAL IZQUIERDO
Busca en el menú de la izquierda (NO en el centro) la sección que dice:
```
⚙️ Settings (Configuración)
   └── Configuration
```

**HAZ CLIC en "Configuration"** (es diferente a "General settings" que ya viste)

### 3. PESTAÑA "General settings"
Una vez dentro de Configuration, verás PESTAÑAS en la parte superior:
- Application settings
- **General settings** ← HAZ CLIC AQUÍ
- Path mappings
- Default documents

### 4. DENTRO DE "General settings"
Busca el campo que dice **"Startup Command"** o **"Stack settings"**

Deberías ver:
```
Stack settings
├── Runtime stack: Node
├── Node version: 20 LTS
└── Startup Command: [VACÍO o con algo] ← AQUÍ
```

### 5. EN "Startup Command"
Escribe exactamente:
```
node server.js
```

### 6. GUARDAR
- Haz clic en **"Save"** (arriba)
- Confirma cuando pregunte sobre reiniciar

---

## 🔍 SI NO ENCUENTRAS "Configuration"

### Alternativa: Settings → Environment variables
Si no ves "Configuration", busca:
```
Settings
   └── Environment variables
```

Dentro agrega una variable:
- Name: `STARTUP_COMMAND`
- Value: `node server.js`

---

## 🚨 OPCIÓN MÁS DIRECTA

### Usando Deployment Center
1. Menú izquierdo → **"Deployment Center"**
2. Arriba verás pestañas, busca **"Settings"**
3. Busca **"Startup command"**
4. Escribe: `node server.js`
5. Save

---

## ✅ VERIFICACIÓN

Después de guardar:
1. Ve a **"Overview"** (menú izquierdo, arriba de todo)
2. Haz clic en **"Restart"** 
3. Espera 1 minuto
4. Prueba: https://ingles-axa9b4awfbf6gbfz.eastus2-01.azurewebsites.net/api/alumnos

---

## 📺 VER LOGS

Para ver si está arrancando:
1. Menú izquierdo → **"Monitoring"**
2. Dentro → **"Log stream"**
3. Deberías ver: `Servidor corriendo en puerto...`

---

## 🆘 ÚLTIMA OPCIÓN: Azure CLI desde aquí

Si no encuentras nada de lo anterior, ejecutaré comandos para configurarlo remotamente.
Dime si quieres que lo intente por CLI.
