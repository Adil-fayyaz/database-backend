@echo off
chcp 65001 >nul
title TUTTO IN UNO - Server + Ngrok + Configura App
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🚀 TUTTO IN UNO - WHITE DEVEL                        ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/5] 🔧 Fermo processi esistenti...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/5] 🚀 Avvio server backend...
start "BlackCyber Server" /MIN cmd /c "cd /d %~dp0blackcyber-backend && node server.js && pause"
timeout /t 5 /nobreak >nul

echo [3/5] 🌐 Avvio ngrok...
start "Ngrok Tunnel" /MIN cmd /c "ngrok http 3000 && pause"
timeout /t 10 /nobreak >nul

echo [4/5] 🔍 Cercando URL ngrok...
powershell -ExecutionPolicy Bypass -File "CONFIGURA_NGROK_AUTO.ps1"
timeout /t 2 /nobreak >nul

echo.
echo [5/5] ✅ Setup completato!
echo.
echo 📋 PROSSIMI PASSI:
echo.
echo 1. Verifica che ngrok sia attivo (finestra minimizzata)
echo 2. Se necessario, esegui CONFIGURA_NGROK.bat per ri-configurare
echo 3. Compila APK: COMPILA_APK.bat
echo 4. Installa APK: INSTALLA_APK.bat
echo.
pause

