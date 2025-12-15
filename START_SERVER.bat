@echo off
echo ========================================
echo    PulseVision - Starting Local Server
echo ========================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Starting server with Python...
    echo.
    echo Server will run at: http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    echo.
    python -m http.server 8000
) else (
    echo Python not found!
    echo.
    echo Please install Python or use another method:
    echo 1. Install Python from https://python.org
    echo 2. Or use Node.js: npx http-server -p 8000
    echo 3. Or use PHP: php -S localhost:8000
    echo.
    pause
)
