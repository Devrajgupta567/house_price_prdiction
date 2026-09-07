@echo off
echo ===================================================
echo   Stopping ValuAltion Services (8000, 8088, 5173)
echo ===================================================

echo Killing processes on port 8000 (Python ML)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo Killing processes on port 9090 (Java Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":9090" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo Killing processes on port 5173 (Vite Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo ===================================================
echo   All ValuAltion platform ports cleared!
echo ===================================================
pause
