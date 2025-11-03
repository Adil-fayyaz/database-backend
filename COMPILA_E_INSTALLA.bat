@echo off
chcp 65001 >nul
title Compila e Installa White Devel
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║   📱 COMPILAZIONE E INSTALLAZIONE WHITE DEVEL           ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd "blackcyber - Copia - Copia - Copia"

echo 🧹 Pulizia progetto...
call flutter clean >nul 2>&1

echo.
echo 📦 Compilazione APK in corso...
echo ⏳ Questo potrebbe richiedere alcuni minuti...
echo.

call flutter build apk --release

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ COMPILAZIONE COMPLETATA!
    echo.
    
    echo 📱 Disinstallo versione precedente...
    adb uninstall com.example.blackcyber >nul 2>&1
    
    echo.
    echo 📲 Installazione nuovo APK...
    adb install build\app\outputs\flutter-apk\app-release.apk
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ╔══════════════════════════════════════════════════════════╗
        echo ║   ✅✅✅ APK INSTALLATO CON SUCCESSO! ✅✅✅            ║
        echo ╚══════════════════════════════════════════════════════════╝
        echo.
        echo 📱 Apri l'app "White Devel" sul telefono!
        echo.
        echo 📝 Registrazione:
        echo    - Nome: adil
        echo    - Paese: paki
        echo.
        echo 🎯 Funzionalità da testare:
        echo    ✓ Messaggi vocali (registra e ascolta)
        echo    ✓ Invio foto (galleria e fotocamera)
        echo    ✓ Invio file
        echo    ✓ Chat private (tocca un utente)
        echo    ✓ Impostazioni gruppo (icona ⚙️)
        echo    ✓ Dashboard sicurezza (icona 🛡️)
        echo.
    ) else (
        echo.
        echo ❌ ERRORE durante l'installazione!
        echo Verifica che il telefono sia collegato.
    )
) else (
    echo.
    echo ❌ ERRORE durante la compilazione!
)

echo.
pause

