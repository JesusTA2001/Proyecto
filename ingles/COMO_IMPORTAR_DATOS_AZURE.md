# 📋 CÓMO IMPORTAR DATOS A AZURE

## Problema
La base de datos de Azure está vacía. Aunque el backend se conecta correctamente a Azure, no hay datos para mostrar.

## Solución

### Opción 1: Usando el Script Automático (RECOMENDADO) ⭐

1. **Abre PowerShell o CMD en la carpeta del proyecto**

2. **Ejecuta el script de importación:**
   ```bash
   node importar_backup_azure.js
   ```

3. **Espera a que termine** (puede tardar 1-2 minutos)
   - Verás un progreso en tiempo real
   - Al final mostrará un resumen con las tablas y cantidad de registros

4. **Reinicia los servidores:**
   ```bash
   iniciar-servidores.bat
   ```

### Opción 2: Usando MySQL Workbench (Manual)

1. **Abre MySQL Workbench**

2. **Crea una nueva conexión a Azure:**
   - Connection Name: `Azure Ingles`
   - Hostname: `mysqlingles.mysql.database.azure.com`
   - Port: `3306`
   - Username: `admin_ingles`
   - Password: `Gui11ermo1`
   - Default Schema: `proyectoIngles`
   - SSL: Use SSL (required)

3. **Conecta y ejecuta el backup:**
   - File → Run SQL Script
   - Selecciona: `backend/scripts/proyectoingles_backup.sql`
   - Default Schema Target: `proyectoIngles`
   - Click "Run"

4. **Espera a que termine** la importación

### Opción 3: Usando MySQL CLI

```bash
mysql -h mysqlingles.mysql.database.azure.com -u admin_ingles -p proyectoIngles --ssl-mode=REQUIRED < backend/scripts/proyectoingles_backup.sql
```

Contraseña: `Gui11ermo1`

## Verificar que Funcionó

1. **Inicia los servidores:**
   ```bash
   iniciar-servidores.bat
   ```

2. **Abre el navegador en:** `http://localhost:3000`

3. **Prueba iniciar sesión con:**
   - **Administrador:**
     - Usuario: `aaron.villegas`
     - Password: `123456`
   
   - **Profesor:**
     - Usuario: `prof_garcia`
     - Password: `123456`
   
   - **Estudiante:**
     - Usuario: `est_1000`
     - Password: `123456`

## Problemas Comunes

### Error: "Cannot connect to Azure"
- Verifica tu conexión a Internet
- Confirma que el firewall de Azure permita tu IP

### Error: "Access denied"
- Verifica las credenciales en el script
- Asegúrate de que el usuario tiene permisos

### Error: "Table already exists"
- Normal si algunas tablas ya existen
- El script continuará con las demás

## Contenido del Backup

El backup incluye:
- ✅ **Usuarios**: Administradores, profesores y estudiantes (200+)
- ✅ **Períodos**: Ciclos escolares
- ✅ **Niveles**: Básico 1-2, Intermedio 1-2, Avanzado 1-2
- ✅ **Grupos**: Grupos asignados a profesores
- ✅ **Calificaciones**: Notas de estudiantes
- ✅ **Asistencias**: Registros de asistencia
- ✅ **Horarios**: Configuración de horarios

## Notas Importantes

⚠️ **CUIDADO**: Este script **sobrescribe** los datos existentes en Azure.

💡 **TIP**: Haz un backup de Azure antes si ya tienes datos importantes.

🔒 **SEGURIDAD**: Las contraseñas en el backup están hasheadas con bcrypt.
