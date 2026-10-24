@echo off
set "PATH=%USERPROFILE%\NodeJS\node-v20.18.0-win-x64;%USERPROFILE%\PortableGit\cmd;%PATH%"
cd /d "%~dp0spicy-box-app"
echo ========================================================
echo    DANG KHOI DONG SPICY BOX SMART WEB APP (DEV SERVER)
echo ========================================================
echo.
npm run dev -- --open
