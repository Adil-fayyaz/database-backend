@echo off
chcp 65001 >nul
title INSTALLA APK BLACK_CYBER_NUOVO

echo.
echo ╔══════════════════════════════════════════════╗
echo ║   INSTALLAZIONE APK BLACK_CYBER_NUOVO        ║
echo ╚══════════════════════════════════════════════╝
echo.

set ADB_PATH=C:\Users\adil\AppData\Local\Microsoft\WinGet\Packages\Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe\platform-tools\adb.exe
set APK_FILE=BLACK_CYBER_NUOVO.apk

echo Controllo dispositivi Android collegati...
echo.
"%ADB_PATH%" devices
echo.

echo ════════════════════════════════════════════════
echo IMPORTANTE PER SAMSUNG:
echo ════════════════════════════════════════════════
echo.
echo Se non vedi dispositivi qui sopra:
echo.
echo 1. Sul telefono: tocca la notifica USB
echo 2. Seleziona "Transfer files" o "MTP" 
echo    (NON "Charging")
echo 3. Attiva USB Debugging nelle Opzioni Sviluppatore
echo 4. Scollega e ricollega il cavo
echo 5. Autorizza USB debugging sul telefono
echo.
echo ════════════════════════════════════════════════
echo.

set /p conferma="Il telefono è collegato e vedi il seriale nella lista? (S/N): "

if /i not "%conferma%"=="S" (
    echo.
    echo ═══════════════════════════════════════════
    echo TROVA LE ISTRUZIONI IN: RISOLVI_SAMSUNG.txt
    echo ═══════════════════════════════════════════
    pause
    exit
)

echo.
echo Avvio installazione...
echo.

"%ADB_PATH%" install -r "%APK_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo ╔═══════════════════════════════════════════╗
    echo ║   ✓ INSTALLATO CON SUCCESSO!             ║
    echo ╚═══════════════════════════════════════════╝
) else (
    echo.
    echo ═══════════════════════════════════════════
    echo ERRORE! Guarda il messaggio sopra
    echo ═══════════════════════════════════════════
)

echo.
pause












