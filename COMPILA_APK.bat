@echo off
chcp 65001 >nul
title Compila APK White Devel
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     📦 COMPILA APK WHITE DEVEL                           ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0blackcyber - Copia - Copia - Copia"

echo.
echo 🔧 Compilazione APK in corso...
echo    (Questo può richiedere alcuni minuti)
echo.

flutter clean
flutter pub get
flutter build apk --release --android-skip-build-dependency-validation

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅✅✅ APK COMPILATO CON SUCCESSO! ✅✅✅
    echo.
    echo 📱 File APK: build\app\outputs\flutter-apk\app-release.apk
    echo.
    echo 🔧 Ora installa l'APK con INSTALLA_APK.bat
    echo.
) else (
    echo.
    echo ❌ Errore durante la compilazione!
    echo.
)

pause

