@echo off
echo ====================================
echo Exportando Base de Datos para Azure
echo ====================================
echo.

REM Configuracion de la base de datos local
set DB_HOST=127.0.0.1
set DB_PORT=3306
set DB_USER=root
set DB_PASSWORD=root
set DB_NAME=proyectoingles
set BACKUP_FILE=proyectoingles_backup.sql

echo [1/3] Verificando conexion a MySQL local...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% -e "SELECT VERSION();" 2>nul
if errorlevel 1 (
    echo ❌ Error: No se pudo conectar a MySQL local
    echo    Verifica que MySQL este corriendo en %DB_HOST%:%DB_PORT%
    pause
    exit /b 1
)
echo ✅ Conexion exitosa

echo.
echo [2/3] Exportando estructura y datos de la base de datos...
mysqldump -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% ^
    --databases %DB_NAME% ^
    --single-transaction ^
    --routines ^
    --triggers ^
    --events ^
    --set-gtid-purged=OFF ^
    --result-file=%BACKUP_FILE%

if errorlevel 1 (
    echo ❌ Error al exportar la base de datos
    pause
    exit /b 1
)
echo ✅ Base de datos exportada exitosamente

echo.
echo [3/3] Verificando archivo de backup...
if exist %BACKUP_FILE% (
    for %%A in (%BACKUP_FILE%) do set SIZE=%%~zA
    echo ✅ Archivo creado: %BACKUP_FILE%
    echo    Tamaño: %SIZE% bytes
) else (
    echo ❌ Error: No se encontro el archivo de backup
    pause
    exit /b 1
)

echo.
echo ====================================
echo ✅ Exportacion completada
echo ====================================
echo.
echo Archivo de backup: %BACKUP_FILE%
echo.
echo Siguientes pasos:
echo 1. Crear Azure Database for MySQL en el portal
echo 2. Configurar reglas de firewall
echo 3. Importar este archivo SQL a Azure
echo.
pause
