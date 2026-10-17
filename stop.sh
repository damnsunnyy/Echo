#!/bin/bash

echo "🛑 Stopping everything..."

pkill -f "uvicorn backend.api.server:app"
pkill -f "backend.voice.listen"
pkill -f "react-scripts start"
pkill -f "ollama serve"

echo "✅ All stopped"