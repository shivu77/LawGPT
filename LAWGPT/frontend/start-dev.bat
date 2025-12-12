@echo off
REM Batch file to start the frontend development server
REM Usage: start-dev.bat

echo Starting LAW-GPT Frontend Development Server...
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
)

REM Start the development server
echo Starting Vite development server on http://localhost:3001...
call npm run dev

pause

