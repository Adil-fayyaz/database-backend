@echo off
chcp 65001 >nul
title AVVIA TUTTO - White Devel
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🚀 AVVIA TUTTO - WHITE DEVEL                         ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] 🔧 Fermo server esistenti...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] 🚀 Avvio server backend...
start "BlackCyber Backend" /MIN cmd /c "cd /d %~dp0blackcyber-backend && node server.js && pause"
timeout /t 5 /nobreak >nul

echo [3/3] ✅ Verifica server...
timeout /t 3 /nobreak >nul
curl -s http://localhost:3000/api/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅✅✅ SERVER FUNZIONA! ✅✅✅
    echo.
    echo 📱 Server disponibile su:
    echo    - Locale: http://localhost:3000/api
    echo    - Rete: http://192.168.1.2:3000/api
    echo.
) else (
    echo.
    echo ⚠️  Server in avvio... (può richiedere qualche secondo)
    echo.
)

echo.
echo ✅ Setup completato!
echo.
echo 🔍 Per installare l'APK sul telefono, usa INSTALLA_APK.bat
echo.
pause
