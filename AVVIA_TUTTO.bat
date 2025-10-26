@echo off
echo ============================================
echo  AdilPrivateServer - Avvio Sistema
echo ============================================
echo.

cd /d "%~dp0"

echo [1/2] Avvio server backend...
start "Server Backend" cmd /k "npm start"

timeout /t 5 /nobreak >nul

echo [2/2] Avvio dashboard frontend...
cd dashboard
start "Dashboard Frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo  Tutto avviato!
echo ============================================
echo.
echo  Server:    http://localhost:5000
echo  Dashboard: http://localhost:3000
echo.
echo  Login: admin@example.com / admin123
echo.
echo  Premi un tasto per chiudere questo prompt...
pause >nul

