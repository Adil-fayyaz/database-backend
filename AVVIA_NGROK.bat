@echo off
chcp 65001 >nul
title Avvia Server + Ngrok
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🚀 AVVIA SERVER + NGROK                              ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] 🔧 Fermo processi esistenti...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] 🚀 Avvio server backend...
start "BlackCyber Server" /MIN cmd /c "cd /d %~dp0blackcyber-backend && node server.js && pause"
timeout /t 5 /nobreak >nul

echo [3/3] 🌐 Avvio ngrok...
start "Ngrok Tunnel" /MIN cmd /c "ngrok http 3000 && pause"

timeout /t 8 /nobreak >nul

echo.
echo ✅ Setup completato!
echo.
echo 📋 PROSSIMI PASSI:
echo.
echo 1. Apri la finestra di ngrok (dovresti vederla minimizzata)
echo 2. Copia l'URL https (esempio: https://xxxx.ngrok-free.app)
echo 3. Usa SET_NGROK_URL.bat per aggiornare l'app
echo.
echo Oppure vai su: http://localhost:4040 per vedere ngrok web interface
echo.
pause

