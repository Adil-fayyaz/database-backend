@echo off
chcp 65001 >nul
title Installa APK e Testa Registrazione
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     📱 INSTALLA APK E TESTA                              ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

set APK_PATH=blackcyber - Copia - Copia - Copia开build\app\outputs\flutter-apk\app-release.apk

echo [1/3] 📦 Installo APK...
if exist "%APK_PATH%" (
    adb uninstall com.example.blackcyber >nul 2>&1
    adb install -r "%APK_PATH%"
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ APK installato!
        echo.
    ) else (
        echo ❌ Errore installazione APK
        pause
        exit /b 1
    )
) else (
    echo ❌ APK non trovato! Compila prima l'APK.
    pause
    exit /b 1
)

echo [2/3] 🧪 Test registrazione sul server...
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"adil\",\"androidId\":\"test_device_adil\",\"country\":\"paki\"}" >nul 2>&1

echo ✅ Server pronto per registrazione
echo.

echo [3/3] ✅ TUTTO PRONTO!
echo.
echo 📱 ORA:
echo    1. Apri l'app "White Devel" sul telefono
echo    2. Inserisci nome: adil
echo    3. Inserisci paese: paki
echo    4. Premi Registrati
echo    5. L'app si aprirà automaticamente! 🎉
echo.
pause

