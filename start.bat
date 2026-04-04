@echo off
echo.
echo 🌱 Starting AgroSense AI Development Environment
echo =================================================
echo.

:: Start Backend
echo 📦 Starting Flask backend...
cd d:\agrosense-premium\backend

if not exist venv (
    echo    Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo    Installing backend dependencies...
pip install -r requirements.txt -q

if not exist .env (
    copy .env.example .env
    echo    ⚠️  Created .env from template. Edit backend\.env to add MONGO_URI.
)

echo    ✅ Backend starting...
start "AgroSense Backend" cmd /k "venv\Scripts\activate && python app.py"
cd ..

timeout /t 3 /nobreak > nul

:: Start Frontend
echo.
echo ⚡ Starting React frontend...
cd d:\agrosense-premium\frontend

if not exist node_modules (
    echo    Installing frontend dependencies...
    npm install
)

echo    ✅ Frontend starting...
start "AgroSense Frontend" cmd /k "npm run dev"
cd ..

echo.
echo =================================================
echo 🚀 AgroSense AI is running!
echo.
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo =================================================
echo.
pause
