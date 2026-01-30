@echo off
REM Quick Start Script for Hackathon Management Website (Windows)

echo.
echo =================================================
echo   Hackathon Management Website - Quick Start
echo =================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Install dependencies
if not exist "node_modules" (
    echo [INSTALLING] Root dependencies...
    call npm install
    if %errorlevel% neq 0 goto error
)

if not exist "server\node_modules" (
    echo [INSTALLING] Server dependencies...
    cd server
    call npm install
    if %errorlevel% neq 0 goto error
    cd ..
)

if not exist "client\node_modules" (
    echo [INSTALLING] Client dependencies...
    cd client
    call npm install
    if %errorlevel% neq 0 goto error
    cd ..
)

echo.
echo [OK] All dependencies installed!
echo.
echo =================================================
echo   Starting Development Servers
echo =================================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000/api
echo.
echo Starting both servers using concurrently...
echo (Press Ctrl+C in a separate terminal to stop)
echo.

REM Start development servers
call npm run dev

goto end

:error
echo.
echo [ERROR] Installation failed
echo Please check the error messages above
pause
exit /b 1

:end
pause
