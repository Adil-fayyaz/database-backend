@echo off
chcp 65001 >nul
title BlackCyber - Avvio Sistema Completo
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🚀 AVVIA SISTEMA COMPLETO BLACKCYBER                ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo 📦 Verifica dipendenze...
echo.

cd /d "%~dp0"

echo [1/3] Avvio backend server...
cd blackcyber-backend
start "BlackCyber Backend" cmd /k "node server.js"
cd ..
timeout /t 3 /nobreak >nul

echo.
echo [2/3] Verifica connessione...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Apertura monitor...
timeout /t 2 /nobreak >nul

echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ SERVER AVVIATO!
echo ════════════════════════════════════════════════════════════
echo.
echo   📱 Configurazione Telefono:
echo      URL: http://192.168.1.2:3000/api
echo.
echo   💻 Test Locale:
echo      Server: http://localhost:3000/api
echo      Health: http://localhost:3000/api/health
echo.
echo   🔍 Per verificare lo stato:
echo      Apri http://localhost:3000/api/health nel browser
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo   Premi un tasto per continuare...
pause >nul

