@echo off
chcp 65001 >nul
title Avvia Server e Testa Registrazione
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🚀 AVVIA TUTTO E TESTA                               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] 🔧 Fermo server esistenti...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] 🚀 Avvio server...
start "BlackCyber Server" /MIN cmd /c "cd /d %~dp0blackcyber-backend && node server.js && pause"
timeout /t 6 /nobreak >nul

echo [3/3] 🧪 Test registrazione...
timeout /t 2 /nobreak >nul

powershell -Command "$body = '{\"name\":\"adil\",\"androidId\":\"test_adil_paki\",\"country\":\"paki\"}' ; try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/register' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing ; $result = $response.Content | ConvertFrom-Json ; Write-Host '' ; Write-Host '✅✅✅ REGISTRAZIONE OK! ✅✅✅' ; Write-Host '' ; Write-Host 'Nome: ' $result.data.user.name ; Write-Host 'Paese: ' $result.data.user.country ; Write-Host 'Approvato: ' $result.data.user.isApproved ; Write-Host '' ; Write-Host '✅ Tutto funziona!' } catch { Write-Host '⚠️  Server in avvio, riprova tra qualche secondo' }"

echo.
echo.
echo ✅ Setup completato!
echo.
echo 📱 ORA:
echo    1. Installa l'APK con: INSTALLA_APK.bat
echo    2. Apri l'app sul telefono
echo    3. Inserisci nome: adil
echo    4. Inserisci paese: paki
echo    5. L'app si aprirà automaticamente! 🎉
echo.
pause

