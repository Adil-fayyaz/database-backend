@echo off
chcp 65001 >nul
title Installa APK BlackCyber
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     📱 INSTALLAZIONE APK BLACKCYBER                      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🔍 Verifica connessione telefono...
adb devices
echo.

echo 📦 Installo APK...
adb install -r "BLACK_CYBER_NUOVO.apk"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo   ✅ INSTALLAZIONE COMPLETATA!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo   📱 L'app è stata installata sul tuo telefono!
    echo.
    echo   ⚠️  IMPORTANTE:
    echo   1. Assic金钱rti che telefono e PC siano sulla STESSA WiFi
    echo   2. Il server deve essere avviato (porta 3000)
    echo   3. Apri l'app e registra un nome utente
    echo.
    echo   🔗 URL Server: http://192.168.1.2:3000/api
    echo.
) else (
    echo.
    echo ⚠️  ERRORE durante l'installazione!
    echo.
    echo Possibili cause:
    echo - Telefono non connesso via USB
    echo - Debug USB non attivato sul telefono
    echo - APK già installato (prova a disinstallare prima)
    echo.
    echo Comandi utili:
    echo   adb devices          - Verifica connessione
    echo   adb uninstall com.blackcyber.app  - Disinstalla app esistente
    echo.
)

echo.
pause

