# 📋 CÓMO VER LOGS EN AZURE - 3 FORMAS

## ✅ OPCIÓN 1: Diagnose and solve problems (MÁS FÁCIL)

1. Azure Portal → Tu App Service **"ingles"**
2. Menú lateral izquierdo → Busca **"Diagnose and solve problems"**
3. Click en **"Application logs"** o **"Availability and Performance"**
4. Verás errores recientes

---

## ✅ OPCIÓN 2: Monitoring → Logs

1. Azure Portal → Tu App Service **"ingles"**
2. Menú lateral izquierdo → Sección **"Monitoring"**
3. Click en **"Logs"**
4. Puede pedirte cerrar un mensaje de bienvenida
5. En la ventana de query, pega esto:

```kusto
AppServiceConsoleLogs
| where TimeGenerated > ago(30m)
| order by TimeGenerated desc
| take 50
```

6. Click en **"Run"**

---

## ✅ OPCIÓN 3: Advanced Tools (Kudu)

1. Azure Portal → Tu App Service **"ingles"**
2. Menú lateral izquierdo → Busca **"Advanced Tools"** o **"Development Tools"**
3. Click en **"Go →"** (se abre nueva pestaña)
4. En Kudu, arriba: **"Debug console"** → **"CMD"**
5. Navega a: `site\wwwroot`
6. Verás los archivos desplegados
7. En el menú superior: **"Tools"** → **"Zip"** (para descargar y ver estructura)

---

## 🔍 ALTERNATIVA RÁPIDA: Verificar estado del App Service

### En Azure Portal:

1. Ve a tu App Service **"ingles"**
2. En la página principal (Overview) mira:
   - **Status**: ¿Dice "Running"?
   - **Default domain**: Haz click en el link

### Si ves página de error o "Your app is up and running":
- El backend NO está ejecutándose correctamente
- Azure no encuentra el `server.js`

---

## 🚀 SOLUCIÓN TEMPORAL: Reiniciar manualmente

1. Azure Portal → App Service **"ingles"**
2. Arriba de todo verás botones:
   - **Stop**
   - **Restart** ← HAZ CLICK AQUÍ
   - Start
3. Espera 1 minuto
4. Prueba: `https://ingles-axa9b4awfbf6gbfz.eastus2-01.azurewebsites.net`

---

## 🎯 DIME QUÉ VES:

### Cuando entras a tu App Service "ingles", en el menú lateral izquierdo, ¿qué opciones ves?

Por ejemplo:
- Overview
- Activity log
- Access control (IAM)
- Tags
- Diagnose and solve problems ← BUSCA ESTA
- ...

**Copia aquí las opciones del menú** para guiarte mejor.
