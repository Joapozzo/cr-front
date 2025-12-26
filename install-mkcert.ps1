# Script para instalar mkcert en Windows
# Ejecutar: powershell -ExecutionPolicy Bypass -File install-mkcert.ps1

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Instalador de mkcert para Windows" -ForegroundColor Cyan
Write-Host ""

# Verificar si mkcert ya esta instalado
$mkcertExists = Get-Command mkcert -ErrorAction SilentlyContinue
if ($mkcertExists) {
    Write-Host "mkcert ya esta instalado en: $($mkcertExists.Source)" -ForegroundColor Green
    Write-Host "   Version: " -NoNewline
    & mkcert -version
    Write-Host ""
    $reinstall = Read-Host "Deseas reinstalar? (S/N)"
    if ($reinstall -ne "S" -and $reinstall -ne "s") {
        Write-Host "Instalacion cancelada." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "Descargando mkcert desde GitHub..." -ForegroundColor Cyan

# Crear carpeta de herramientas si no existe
$toolsDir = "$env:USERPROFILE\tools"
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir -Force | Out-Null
    Write-Host "Carpeta creada: $toolsDir" -ForegroundColor Green
}

# Obtener la ultima version de mkcert
try {
    $latestRelease = Invoke-RestMethod -Uri "https://api.github.com/repos/FiloSottile/mkcert/releases/latest"
    $downloadUrl = $latestRelease.assets | Where-Object { $_.name -like "*windows-amd64.exe" } | Select-Object -First 1 -ExpandProperty browser_download_url
    
    if (-not $downloadUrl) {
        throw "No se pudo encontrar el archivo de descarga"
    }
    
    $mkcertPath = Join-Path $toolsDir "mkcert.exe"
    
    # Descargar mkcert
    Write-Host "   Descargando desde: $downloadUrl" -ForegroundColor Gray
    Invoke-WebRequest -Uri $downloadUrl -OutFile $mkcertPath -UseBasicParsing
    
    Write-Host "mkcert descargado en: $mkcertPath" -ForegroundColor Green
    
    # Agregar al PATH del usuario si no esta
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $pathToAdd = $toolsDir
    if ($currentPath -notlike "*$pathToAdd*") {
        Write-Host ""
        Write-Host "Agregando $pathToAdd al PATH..." -ForegroundColor Cyan
        $newPath = "$currentPath;$pathToAdd"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "Agregado al PATH del usuario" -ForegroundColor Green
        Write-Host "   IMPORTANTE: Cierra y vuelve a abrir PowerShell para usar mkcert" -ForegroundColor Yellow
    } else {
        Write-Host "$pathToAdd ya esta en el PATH" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Instalacion completada!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Siguientes pasos:" -ForegroundColor Cyan
    Write-Host "1. Si acabas de agregar al PATH, cierra y vuelve a abrir PowerShell" -ForegroundColor White
    Write-Host "2. Ejecuta: mkcert -install" -ForegroundColor White
    Write-Host "3. Ve a la carpeta cr-front y ejecuta los comandos de configuracion" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "Error al descargar mkcert: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Descarga manual:" -ForegroundColor Yellow
    Write-Host "1. Ve a: https://github.com/FiloSottile/mkcert/releases/latest" -ForegroundColor White
    Write-Host "2. Descarga: mkcert-v*-windows-amd64.exe" -ForegroundColor White
    Write-Host "3. Renombralo a mkcert.exe" -ForegroundColor White
    Write-Host "4. Colocalo en una carpeta y agregalo al PATH" -ForegroundColor White
    exit 1
}
