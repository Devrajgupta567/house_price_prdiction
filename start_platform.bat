@echo off
echo ===================================================
echo   Starting ValuAltion Full-Stack Platform
echo ===================================================

echo [1/3] Starting Python ML Microservice on port 8000...
start "ValuAltion - Python ML Service (8000)" cmd /k ".\zenml-env\Scripts\python.exe -m uvicorn api.main:app --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Java Spring Boot Backend on port 9090...
start "ValuAltion - Java Backend (9090)" cmd /k "java -jar backend\target\backend-1.0.0.jar"

timeout /t 3 /nobreak >nul

echo [3/3] Starting React Frontend on port 5173...
start "ValuAltion - React Frontend (5173)" cmd /k "cd web && npm run dev"

echo ===================================================
echo   All services launched!
echo   Frontend:   http://localhost:5173
echo   Java API:   http://localhost:9090/api/v1/health
echo   ML Service: http://localhost:8000/health
echo ===================================================
pause
