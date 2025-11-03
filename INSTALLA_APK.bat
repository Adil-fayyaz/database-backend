@echo off
chcp 65001 >nul
title Installa APK White Devel
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     📱 INSTALLA APK WHITE DEVEL                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

set APK_PATH=blackcyber - Copia - Copia - Copia\build\app\outputs\flutter-apk\app-release.apk

if not exist "%APK_PATH%" (
    echo ❌ APK non trovato!
    echo.
    echo 🔧 Compilazione APK in corso...
    cd "blackcyber - Copia - Copia - Copia"
    call flutter build apk --release --android-skip-build-dependency-validation
    cd ..
    timeout /t 2 /nobreak >nul
)

if not exist "%APK_PATH%" (
    echo.
    echo ❌ Impossibile trovare l'APK compilato!
    echo    Verifica che Flutter sia installato e configurato.
    pause
    exit /b 1
)

echo.
echo 📱 Disinstalla versione precedente...
adb uninstall com.example.blackcyber >nul 2>&1

echo.
echo 📦 Installo nuovo APK...
adb install -r "%APK_PATH%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅✅✅ APK INSTALLATO CON SUCCESSO! ✅✅✅
    echo.
    echo 📱 L'app "White Devel" è ora installata sul telefono!
    echo.
) else (
    echo.
    echo ❌ Errore durante l'installazione!
    echo    Verifica che:
    echo    - Il telefono sia collegato via USB
    echo    - Il debug USB sia attivo
    echo    - ADB sia configurato correttamente
    echo.
)

pause

