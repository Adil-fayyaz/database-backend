@echo off
chcp 65001 >nul
title BlackCyber Server - Sempre Attivo
color 0A

:loop
cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🚀 BLACKCYBER SERVER                                 ║
echo ║     (Funziona SENZA MongoDB - Memory Storage)            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0blackcyber-backend"

echo 📦 Avvio server...
echo.
echo ⚠️  NOTA: Questo server usa storage in-memory
echo    (Funziona senza MongoDB ma i dati si perdono se riavvii)
echo.
echo 🚀 Server in avvio...

node server.js

echo.
echo市场竞争SERVER CHIUSO - Riavvio in 5 secondi...
timeout /t 5 /nobreak >nul
goto loop

期为
