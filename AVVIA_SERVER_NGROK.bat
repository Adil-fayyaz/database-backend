@echo off
chcp 65001 >nul
title Avvia Server + ngrok
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🚀 AVVIA SERVER + NGROK (URL PUBBLICO)              ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0blackcyber-backend"

echo [1/2] Avvio server backend...
start "BlackCyber Server" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Avvio ngrok (𝜶 serve avere ngrok installato)...
echo.

where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  ngrok non trovato!
    echo.
    echo 📥 INSTALLA NGROK:
    echo    1. Vai su: https://ngrok.com/download
    echo    2. Scarica per Windows
    echo    3. Estrai ngrok.exe
    echo    4. Metti ngrok.exe in una cartella in PATH
    echo       (es: C:\Windows\System32)
    echo    5. Riavvia questo script
    echo.
    pause
    exit
)

echo ✅ ngrok trovato!
echo.
echo 🌐 Avvio tunnel pubblico...
echo    L'URL sarà visibile qui sotto!
echo.

ngrok http 3000

pause

