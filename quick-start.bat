@echo off
REM Nexus Media Downloader - Quick Start Script for Windows
REM This script checks prerequisites and starts the development environment

echo ========================================
echo Nexus Media Downloader - Quick Start
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found
    echo Please install Node.js 20+ from https://nodejs.org/
    exit /b 1
)
node -v
echo.

REM Check Python
echo Checking Python...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found
    echo Please install Python 3.11+ from https://python.org/
    exit /b 1
)
python --version
echo.

REM Check FFmpeg
echo Checking FFmpeg...
where ffmpeg >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] FFmpeg not found
    echo FFmpeg is required for media processing
    echo Install: choco install ffmpeg
    echo.
)

echo Installing dependencies...
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
if not exist "node_modules" (
    call npm install
) else (
    echo node_modules exists, skipping...
)

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd api

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
cd ..

echo.
echo [SUCCESS] All dependencies installed!
echo.

REM Check for .env file
if not exist ".env" (
    echo [WARNING] No .env file found. Creating from .env.example...
    copy .env.example .env
    echo Please edit .env with your configuration
)

echo.
echo ========================================
echo Setup complete!
echo.
echo To start the development servers:
echo.
echo   Terminal 1 (Frontend):
echo   npm run dev
echo.
echo   Terminal 2 (Backend):
echo   npm run api:dev
echo.
echo Then open http://localhost:3000 in your browser
echo ========================================
echo.

pause
