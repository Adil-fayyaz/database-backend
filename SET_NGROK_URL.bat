@echo off
chcp 65001 >nul
title Configura URL Ngrok Invasion
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🔧 CONFIGURA URL NGROK                               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

set "CONFIG_FILE=blackcyber - Copia - Copia - Copia\lib\services\backend_config.dart"

if not exist "%CONFIG_FILE%" (
    echo ❌ File non trovato: %CONFIG_FILE%
    pause
    exit /b 1
)

echo.
echo Inserisci l'URL di ngrok (senza / alla fine):
echo Esempio: https://abc123.ngrok-free.app
echo.
set /p NGROK_URL="URL ngrok: "

if "%NGROK_URL%"=="" (
    echo ❌ URL non può essere vuoto!
    pause
    exit /b 1
)

echo.
echo 📝 Aggiorno configurazione...
echo.

powershell -Command "$content = Get-Content '%CONFIG_FILE%' -Raw; $content = $content -replace 'static const String BASE_URL = [^;]+;', 'static const String BASE_URL = ''%NGROK_URL%/api'';'; $content = $content -replace 'static const String SOCKET_URL = [^;]+;', 'static const String SOCKET_URL = ''%NGROK_URL%'';'; $content = $content -replace '// static const String BASE_URL = ''https://[^'']+'';', '// static const String BASE_URL = ''http://192.168.1.2:3000/api'';'; $content = $content -replace '// static const String SOCKET_URL = ''https://[^'']+'';', '// static const String SOCKET_URL = ''http://192.168.1.2:3000'';'; Set-Content '%CONFIG_FILE%' -Value $content"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Configurazione aggiornata!
    echo.
    echo 📱 URL configurato: %NGROK_URL%
    echo.
    echo 🔧 Ora compila un nuovo APK con COMPILA_APK.bat
    echo.
) else (
    echo.
    echo ❌ Errore durante l'aggiornamento!
    echo.
)

pause

