@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\git-manual.ps1" -Acao catalogo
set "result=%errorlevel%"
echo.
pause
exit /b %result%
