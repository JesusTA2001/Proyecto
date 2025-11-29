@echo off
echo ====================================
echo Importando Base de Datos a Azure
echo ====================================
echo.

REM CONFIGURACION - MODIFICAR CON TUS DATOS DE AZURE
set AZURE_HOST=mysqlingles.mysql.database.azure.com
set AZURE_USER=admin_ingles
set AZURE_PORT=3306
set BACKUP_FILE=proyectoingles_backup.sql

echo IMPORTANTE: Asegurate de haber configurado:
echo 1. Reglas de firewall en Azure Portal
echo 2. Tu IP actual esta permitida
echo 3. Servicios de Azure estan habilitados
echo.
echo Presiona cualquier tecla para continuar o CTRL+C para cancelar...
pause >nul

echo.
echo [1/3] Verificando archivo de backup...
if not exist %BACKUP_FILE% (
    echo ❌ Error: No se encontro el archivo %BACKUP_FILE%
    echo    Ejecuta primero: exportar_db_para_azure.bat
    pause
    exit /b 1
)
echo ✅ Archivo encontrado: %BACKUP_FILE%

echo.
echo [2/3] Probando conexion a Azure MySQL...
echo (Se te pedira la contraseña de Azure)
mysql -h %AZURE_HOST% -P %AZURE_PORT% -u %AZURE_USER% --ssl-mode=REQUIRED -e "SELECT VERSION();"
if errorlevel 1 (
    echo ❌ Error: No se pudo conectar a Azure MySQL
    echo    Verifica:
    echo    - Host: %AZURE_HOST%
    echo    - Usuario: %AZURE_USER%
    echo    - Reglas de firewall en Azure Portal
    pause
    exit /b 1
)
echo ✅ Conexion exitosa a Azure

echo.
echo [3/3] Importando base de datos a Azure...
echo (Esto puede tardar varios minutos)
echo.
mysql -h %AZURE_HOST% -P %AZURE_PORT% -u %AZURE_USER% --ssl-mode=REQUIRED < %BACKUP_FILE%

if errorlevel 1 (
    echo ❌ Error al importar la base de datos
    pause
    exit /b 1
)

echo.
echo ====================================
echo ✅ Importacion completada
echo ====================================
echo.
echo Siguientes pasos:
echo 1. Actualizar archivo backend/.env con credenciales de Azure
echo 2. Reiniciar el servidor backend
echo 3. Probar la conexion con: node test_login.js
echo.
pause
