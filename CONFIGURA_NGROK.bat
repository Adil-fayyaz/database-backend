@echo off
chcp 65001 >nul
title Configura Ngrok Automatico
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     🔧 CONFIGURA NGROK AUTOMATICO                        ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

powershell -ExecutionPolicy Bypass -File "CONFIGURA_NGROK_AUTO.ps1"

pause

