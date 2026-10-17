#!/bin/bash

echo "🚀 Starting Echo AI System..."

# Go to project root
cd "$(cd "$(dirname "$0")" && pwd)"

# Activate venv
source venv/bin/activate

# Start Ollama (background)
echo "🧠 Starting Ollama..."
ollama serve > /dev/null 2>&1 &

# Start backend
echo "🌐 Starting backend..."
uvicorn backend.api.server:app --reload > backend.log 2>&1 &

# Start assistant
echo "🎤 Starting assistant..."
python -m backend.voice.listen > assistant.log 2>&1 &

# Start dashboard
echo "🖥️ Starting dashboard..."
cd dashboard
npm start > dashboard.log 2>&1 &

echo "✅ All systems started!"