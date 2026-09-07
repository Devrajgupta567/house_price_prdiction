Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   Starting ValuAltion Full-Stack Platform" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Start Python ML Microservice
Write-Host "[1/3] Starting Python ML Microservice on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\zenml-env\Scripts\python.exe -m uvicorn api.main:app --host 127.0.0.1 --port 8000"

Start-Sleep -Seconds 2

# 2. Start Java Spring Boot Backend
Write-Host "[2/3] Starting Java Spring Boot Backend on port 9090..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "java -jar backend\target\backend-1.0.0.jar"

Start-Sleep -Seconds 3

# 3. Start React Frontend
Write-Host "[3/3] Starting React Frontend on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   All services launched!" -ForegroundColor Green
Write-Host "   Frontend:   http://localhost:5173" -ForegroundColor Yellow
Write-Host "   Java API:   http://localhost:9090/api/v1/health" -ForegroundColor Yellow
Write-Host "   ML Service: http://localhost:8000/health" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan
