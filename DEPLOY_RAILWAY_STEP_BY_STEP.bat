@echo off
chcp 65001 >nul
title Deploy Railway - Step by Step
color 0B

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     🚀 DEPLOY SU RAILWAY - PC SEMPRE SPENTO, APP SEMPRE ON   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 📋 STEP 1: INSTALLA RAILWAY CLI
echo.
echo Esegui questo comando:
echo.
echo    npm install -g @railway/cli
echo.
pause

echo.
echo 📋 STEP 2: LOGIN SU RAILWAY
echo.
echo Esegui:
echo    railway login
echo.
echo Si aprirà il browser per fare login.
echo.
pause

echo.
echo 📋 STEP 3: INIZIALIZZA PROGETTO
echo.
cd blackcyber-backend
echo Posizione: blackcyber-backend
echo.
echo Esegui:
echo    railway init
echo.
echo Scegli: "Create new project"
echo Nome progetto: white-devel-backend
echo.
pause

echo.
echo 📋 STEP 4: AGGIUNGI VARIABILI AMBIENTE
echo.
echo Esegui:
echo    railway variables set PORT=3000
echo    railway variables set NODE_ENV=production
echo.
pause

echo.
echo 📋 STEP 5: DEPLOY!
echo.
echo Esegui:
echo    railway up
echo.
echo ⏳ Attendi il deploy (2-3 minuti)...
echo.
pause

echo.
echo 📋 STEP 6: OTTIENI URL
echo.
echo Esegui:
echo    railway domain
echo.
echo Copia l'URL generato!
echo Esempio: https://white-devel-backend-production.up.railway.app
echo.
pause

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                     ✅ DEPLOY COMPLETATO! ✅                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🎯 PROSSIMI PASSI:
echo.
echo 1. Copia URL Railway
echo 2. Apri: blackcyber - Copia - Copia - Copia\lib\services\backend_config.dart
echo 3. Cambia BASE_URL con URL Railway
echo 4. Ricompila APK
echo 5. Installa sul telefono
echo 6. TESTA CON AMICI DA ALTRI PAESI!
echo.
echo 🌍 L'APP FUNZIONERÀ SEMPRE, ANCHE CON PC SPENTO! 🎉
echo.
pause

