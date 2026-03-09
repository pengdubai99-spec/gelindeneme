@echo off
setlocal
echo ============================================================
echo      COUTUREMASTER ULTRATRANSFER - BRIDAL AI STARTUP
echo ============================================================
echo.

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

if not exist "node_modules" (
    echo [!] Node modules bulunamadi. Yukleme baslatiliyor...
    call npm install --legacy-peer-deps
)

echo [i] Uygulama baslatiliyor (Vite Dev Server)...
echo [i] Tarayicinizda http://localhost:5173 adresini acin.
echo.

call npm run dev

pause
