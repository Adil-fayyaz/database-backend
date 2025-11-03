@echo off
chcp 65001 >nul
title Compila White Devel APK
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🔨 COMPILA WHITE DEVEL APK                           ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0blackcyber - Copia - Copia - Copia"

echo 📦 Pulizia build precedente...
if exist "build" (
    rd /s /q build
)
echo.

echo 🔨 Compilazione APK in corso...
echo ⏳ Questo potrebbe richiedere alcuni minuti...
echo.

flutter clean
flutter pub get
flutter build apk --release

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo   ✅ COMPILAZIONE COMPLETATA!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo   📦 APK creato in:
    echo   build\app\outputs\flutter-apk\app-release.apk
    echo.
    echo   📱 Ora installo sul telefono...
    echo.
    
    if exist "build\app\outputs\flutter-apk\app-release.apk" (
        cd ..
        adb install -r "blackcyber - Copia - Copia - Copia\build\app\outputs\flutter-apk\app-release.apk"
        
        if %ERRORLEVEL% EQU 0 (
            echo.
            echo ✅ INSTALLAZIONE COMPLETATA!
            echo.
            echo 📱 L'app "White Devel" è ora installata sul telefono!
        ) else (
            echo.
            echo ⚠️  Errore durante l'installazione
            echo    APK disponibile in: build\app\outputs\flutter-apk\app-release.apk
        )
    )
) else (
    echo.
    echo ❌ ERRORE durante la compilazione!
)

echo.
pause

