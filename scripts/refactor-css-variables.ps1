# Script para refactorizar variables CSS a formato semántico
# Ejecutar desde la raíz del proyecto: .\scripts\refactor-css-variables.ps1

$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts,*.css

$replacements = @{
    'var\(--green\)' = 'var(--color-primary)'
    'var\(--green-win\)' = 'var(--color-primary-strong)'
    'var\(--green-opacity\)' = 'var(--color-primary-opacity)'
    'var\(--red\)' = 'var(--color-secondary)'
    'var\(--success\)' = 'var(--color-success)'
    'var\(--danger\)' = 'var(--color-danger)'
    'var\(--warning\)' = 'var(--color-warning)'
    'var\(--red-500\)' = 'var(--color-secondary-500)'
    'var\(--red-600\)' = 'var(--color-secondary-600)'
    'var\(--red-700\)' = 'var(--color-secondary-700)'
    'var\(--red-400\)' = 'var(--color-secondary-400)'
    'var\(--red-300\)' = 'var(--color-secondary-300)'
    'var\(--red-100\)' = 'var(--color-secondary-100)'
    'var\(--green-300\)' = 'var(--color-primary-300)'
    'var\(--green-400\)' = 'var(--color-primary-400)'
    'var\(--green-500\)' = 'var(--color-primary-500)'
    'var\(--green-800\)' = 'var(--color-primary-800)'
    'var\(--yellow-500\)' = 'var(--color-warning)'
    'var\(--yellow-400\)' = 'var(--color-warning)'
    'var\(--yellow-300\)' = 'var(--color-warning)'
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        $matches = [regex]::Matches($content, $pattern)
        if ($matches.Count -gt 0) {
            $content = $content -replace $pattern, $replacement
            $fileReplacements += $matches.Count
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $totalFiles++
        $totalReplacements += $fileReplacements
        Write-Host "Processed: $($file.FullName) - $fileReplacements replacements" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Refactoring completed:" -ForegroundColor Cyan
Write-Host "Files modified: $totalFiles" -ForegroundColor Yellow
Write-Host "Total replacements: $totalReplacements" -ForegroundColor Yellow
