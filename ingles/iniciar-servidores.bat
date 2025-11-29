@echo off
echo ====================================
echo Iniciando servidores...
echo ====================================
echo.

cd /d "c:\Users\jesus\OneDrive\Escritorio\CURSOS PROGRAMACION\Proyecto Maestria\ingles\backend"

echo [1/2] Iniciando Backend (Puerto 5000)...
start "Backend Server" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

cd /d "c:\Users\jesus\OneDrive\Escritorio\CURSOS PROGRAMACION\Proyecto Maestria\ingles"

echo [2/2] Iniciando Frontend (Puerto 3000)...
start "Frontend Server" cmd /k "set PORT=3000 && npm start"

echo.
echo ====================================
echo Servidores iniciados!
echo ====================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
