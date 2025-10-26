# Quick Start Script per AdilPrivateServer
# Esegui questo file per configurare tutto automaticamente

Write-Host "🚀 AdilPrivateServer - Quick Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verifica Node.js
Write-Host "1️⃣ Verificando Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "✅ Node.js installato: " -NoNewline -ForegroundColor Green
    node --version
} else {
    Write-Host "❌ Node.js non installato!" -ForegroundColor Red
    Write-Host "Scarica da: https://nodejs.org" -ForegroundColor Yellow
    exit
}

# Step 2: Verifica MongoDB
Write-Host "2️⃣ Verificando MongoDB..." -ForegroundColor Yellow
$mongodbRunning = $false

# Controlla se MongoDB è installato come servizio
if (Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue) {
    $service = Get-Service -Name "MongoDB"
    if ($service.Status -eq "Running") {
        Write-Host "✅ MongoDB è in esecuzione!" -ForegroundColor Green
        $mongodbRunning = $true
    } else {
        Write-Host "⚠️  MongoDB è installato ma non è in esecuzione" -ForegroundColor Yellow
        Write-Host "Avvio di MongoDB..." -ForegroundColor Yellow
        Start-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        if (Get-Service -Name "MongoDB").Status -eq "Running" {
            Write-Host "✅ MongoDB avviato!" -ForegroundColor Green
            $mongodbRunning = $true
        }
    }
}

if (-not $mongodbRunning) {
    Write-Host "❌ MongoDB non è installato o non è in esecuzione" -ForegroundColor Red
    Write-Host ""
    Write-Host "SOLUZIONI:" -ForegroundColor Cyan
    Write-Host "1. Installa MongoDB: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host "2. Oppure usa MongoDB Atlas: https://www.mongodb.com/cloud/atlas" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Leggi: QUICK_MONGODB_FIX.md per istruzioni dettagliate" -ForegroundColor Yellow
    exit
}

# Step 3: Crea file .env
Write-Host "3️⃣ Verificando file .env..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    if (Test-Path "env.template") {
        Copy-Item "env.template" ".env"
        Write-Host "✅ File .env creato da template" -ForegroundColor Green
    } else {
        Write-Host "❌ Template .env non trovato!" -ForegroundColor Red
        exit
    }
} else {
    Write-Host "✅ File .env già esistente" -ForegroundColor Green
}

# Step 4: Genera le chiavi JWT
Write-Host "4️⃣ Generando chiavi di sicurezza..." -ForegroundColor Yellow
node scripts/generate-keys.js
Write-Host "⚠️  IMPORTANTE: Copia la chiave JWT nel file .env!" -ForegroundColor Yellow

# Step 5: Popola il database
Write-Host ""
Write-Host "5️⃣ Popolando il database con dati di test..." -ForegroundColor Yellow
Read-Host "Premi ENTER per continuare"
npm run seed

Write-Host ""
Write-Host "🎉 Setup completato!" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Prossimi passi:" -ForegroundColor Cyan
Write-Host "1. Avvia il server: npm start" -ForegroundColor White
Write-Host "2. In un altro terminale, avvia la dashboard: cd dashboard && npm run dev" -ForegroundColor White
Write-Host "3. Apri il browser: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Credenziali di test:" -ForegroundColor Cyan
Write-Host "Email: admin@example.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White

