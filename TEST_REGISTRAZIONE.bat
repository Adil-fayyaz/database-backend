@echo off
chcp 65001 >nul
title Test Registrazione Adil - Paki
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo Concurrent ║     🧪 TEST REGISTRAZIONE                      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo 📝 Test registrazione con:
echo    Nome: adil
echo    Paese: paki
echo.

curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"adil\",\"androidId\":\"test_adil_001\",\"country\":\"paki\"}"

echo.
echo.
echo ✅ Se vedi "success": true sopra, la registrazione funziona!
echo.
pause

