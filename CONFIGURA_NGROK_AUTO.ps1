# Script PowerShell per configurare automaticamente ngrok nell'app

Write-Host "🔍 Cercando URL ngrok..." -ForegroundColor Yellow

# Attendi che ngrok sia pronto
$maxAttempts = 15
$attempt = 0
$ngrokUrl = $null

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -TimeoutSec 2 -ErrorAction Stop
        $ngrokUrl = ($response.tunnels | Where-Object { $_.proto -eq 'https' } | Select-Object -First 1).public_url
        if ($ngrokUrl) {
            break
        }
    } catch {
        Start-Sleep -Seconds 2
        $attempt++
    }
}

if (-not $ngrokUrl) {
    Write-Host "❌ Ngrok non trovato! Avvia ngrok con: ngrok http 3000" -ForegroundColor Red
    Write-Host "   Oppure vai su http://localhost:4040 per vedere l'URL" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ URL ngrok trovato: $ngrokUrl" -ForegroundColor Green
Write-Host ""

# Aggiorna backend_config.dart
$configFile = "blackcyber - Copia - Copia - Copia\lib\services\backend_config.dart"

if (-not (Test-Path $configFile)) {
    Write-Host "❌ File non trovato: $configFile" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Aggiorno configurazione..." -ForegroundColor Yellow

$content = Get-Content $configFile -Raw

# Aggiorna BASE_URL e SOCKET_URL con ngrok
$content = $content -replace "static const String BASE_URL = [^;]+;", "static const String BASE_URL = '$ngrokUrl/api';"
$content = $content -replace "static const String SOCKET_URL = [^;]+;", "static const String SOCKET_URL = '$ngrokUrl';"

# Commenta le righe locali
$content = $content -replace "^  // Per rete locale", "  // Per rete locale (commentato - usa ngrok)"
$content = $content -replace "^  // Per ngrok", "  // Per ngrok (ATTIVO)"

Set-Content $configFile -Value $content -NoNewline

Write-Host ""
Write-Host "✅ Configurazione aggiornata!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 BASE_URL: $ngrokUrl/api" -ForegroundColor Cyan
Write-Host "📡 SOCKET_URL: $ngrokUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Ora compila l'APK con: COMPILA_APK.bat" -ForegroundColor Yellow
Write-Host ""

