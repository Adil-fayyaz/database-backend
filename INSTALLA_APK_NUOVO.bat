@echo off
echo ========================================
echo   INSTALLA APK BLACK_CYBER_NUOVO
echo ========================================
echo.

set ADB_PATH="C:\Users\adil\AppData\Local\Microsoft\WinGet\Packages\Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe\platform-tools\adb.exe"
set APK_FILE=BLACK_CYBER_NUOVO.apk

echo Controllo dispositivi collegati...
echo.

"%ADB_PATH%" devices
echo.

echo Verifica che il dispositivo sia mostrato nella lista sopra.
echo Se non vedi dispositivi:
echo 1. Collega il telefono via USB
echo 2. Attiva la modalita USB Debugging sul telefono
echo 3. Accetta il messaggio "Allow USB debugging"
echo.

pause

echo.
echo Installazione APK in corso...
echo.

"%ADB_PATH%" install "%APK_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   INSTALLAZIONE COMPLETATA CON SUCCESSO!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   ERRORE DURANTE L'INSTALLAZIONE
    echo ========================================
    echo.
    echo Possibili cause:
    echo - Dispositivo non collegato
    echo - USB Debugging non attivato
    echo - APK gia installato (prova: adb uninstall)
)

echo.
pause












