#!/bin/bash

echo "🚀 Starting Code Snippet Sharing Platform..."
echo "=========================================="

# Function to kill processes on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend server
echo "📡 Starting backend server on port 5000..."
cd /workspace/backend
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Test backend
echo "🧪 Testing backend health..."
if curl -s http://localhost:5000/api/health >/dev/null 2>&1; then
    echo "✅ Backend server is running successfully!"
else
    echo "❌ Backend server failed to start"
fi

# Start frontend server
echo "🎨 Starting frontend server on port 3000..."
cd /workspace/frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🌟 Servers started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "❤️  Health Check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait