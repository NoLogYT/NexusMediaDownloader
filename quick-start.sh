#!/bin/bash

# Nexus Media Downloader - Quick Start Script
# This script checks prerequisites and starts the development environment

set -e

echo "🚀 Nexus Media Downloader - Quick Start"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Found $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

# Check Python
echo -n "Checking Python... "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Found $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python not found"
    echo "Please install Python 3.11+ from https://python.org/"
    exit 1
fi

# Check FFmpeg
echo -n "Checking FFmpeg... "
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1 | cut -d' ' -f3)
    echo -e "${GREEN}✓${NC} Found version $FFMPEG_VERSION"
else
    echo -e "${YELLOW}⚠${NC} FFmpeg not found"
    echo "FFmpeg is required for media processing"
    echo "Install: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)"
fi

echo ""
echo "Installing dependencies..."
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "node_modules exists, skipping..."
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd api
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

pip install -q -r requirements.txt
cd ..

echo ""
echo -e "${GREEN}✓${NC} All dependencies installed!"
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "Please edit .env with your configuration"
fi

echo ""
echo "========================================"
echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo ""
echo "  Terminal 1 (Frontend):"
echo "  $ npm run dev"
echo ""
echo "  Terminal 2 (Backend):"
echo "  $ npm run api:dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo "========================================"
