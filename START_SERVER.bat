@echo off
chcp 65001 >nul
title BlackCyber Server
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🚀 AVVIA BLACKCYBER BACKEND SERVER                  ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0\blackcyber-backend"

if not exist "config.env" (
    echo ⚠️  File config.env non trovato!
    echo Creazione file config.env...
    echo MONGODB_URI=mongodb+srv://adilfayyaz388:PASSWORD@cluster0.axbaokd.mongodb.net/blackcyber?retryWrites=true&w=majority > config.env
    echo JWT_SECRET=blackcyber-super-secret-key-2024-production-ready >> config.env
    echo PORT=3000 >> config.env
    echo NODE_ENV=development >> config.env
    echo.
    echo ⚠️  IMPORTANTE: Modifica config.env e sostituisci PASSWORD con la tua password MongoDB!
    echo.
    pause
)

echo 📦 Verifica dipendenze...
if not exist "node_modules" (
    echo Installazione dipendenze...
    call npm install
    echo.
)

echo.
echo 🚀 Avvio server...
echo.
echo ════════════════════════════════════════════════════════════
echo   Server attivo su:
echo   - Locale: http://localhost:3000/api
echo   - Rete: http://192.168.1.2:3000/api
echo ════════════════════════════════════════════════════════════
echo.
echo   Per verificare: http://localhost:3000/api/health
echo.
echo   Premi Ctrl+C per fermare il server
echo.

node server.js

pause

