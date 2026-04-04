#!/bin/bash
# AgroSense AI — Development Startup Script
# Run this from the project root: bash start.sh

set -e

echo ""
echo "🌱 Starting AgroSense AI Development Environment"
echo "================================================="
echo ""

# Start backend
echo "📦 Starting Flask backend..."
cd d:\agrosense-premium\backend
if [ ! -d "venv" ]; then
    echo "   Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

echo "   Installing backend dependencies..."
pip install -r requirements.txt -q

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "   ⚠️  Created .env from template. Edit backend/.env to add MONGO_URI."
fi

echo "   ✅ Backend ready"
python app.py &
BACKEND_PID=$!
cd ..

# Give backend a moment to start
sleep 2

# Start frontend
echo ""
echo "⚡ Starting React frontend..."
cd d:\agrosense-premium\frontend
if [ ! -d "node_modules" ]; then
    echo "   Installing frontend dependencies..."
    npm install
fi

echo "   ✅ Frontend ready"
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================================="
echo "🚀 AgroSense AI is running!"
echo ""
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all services"
echo "================================================="
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
