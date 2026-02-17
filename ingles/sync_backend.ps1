# Script para sincronizar backend con Azure
$backendLocal = "c:\Users\jesus\OneDrive\Escritorio\CURSOS PROGRAMACION\Proyecto Maestria\ingles\backend"
$repoAzure = "c:\Users\jesus\OneDrive\Escritorio\CURSOS PROGRAMACION\API-AZURE"

Write-Host "Sincronizando backend..." -ForegroundColor Cyan

if (-not (Test-Path $repoAzure)) {
    Write-Host "Clonando repo API-AZURE..." -ForegroundColor Yellow
    Set-Location "c:\Users\jesus\OneDrive\Escritorio\CURSOS PROGRAMACION"
    git clone https://github.com/JesusTA2001/API-AZURE.git
}

Write-Host "Copiando archivos..." -ForegroundColor Cyan

$archivos = @(
    "controllers\administradorController.js",
    "controllers\alumnoController.js",
    "controllers\profesorController.js",
    "controllers\grupoController.js"
)

foreach ($archivo in $archivos) {
    $origen = Join-Path $backendLocal $archivo
    $destino = Join-Path $repoAzure $archivo
    
    if (Test-Path $origen) {
        $dir = Split-Path $destino -Parent
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        Copy-Item -Path $origen -Destination $destino -Force
        Write-Host "  OK: $archivo" -ForegroundColor Green
    }
}

Set-Location $repoAzure
git status

Write-Host ""
$r = Read-Host "Subir cambios? (s/n)"
if ($r -eq "s") {
    git add .
    git commit -m "Update controllers"
    git push origin master
    Write-Host "Listo!" -ForegroundColor Green
}
