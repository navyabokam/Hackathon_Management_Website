#!/bin/bash
# Quick Start Script for Hackathon Management Website

echo "🚀 Starting Hackathon Management Website..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "🎯 Starting development servers..."
echo ""
echo "To run both servers together, use:"
echo "  npm run dev"
echo ""
echo "Or run them separately (recommended for Windows):"
echo "  Terminal 1: npm run dev:server"
echo "  Terminal 2: npm run dev:client"
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API at: http://localhost:4000/api"
echo ""

# For interactive shells, offer to start
if [ -t 0 ]; then
    read -p "Start development servers now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run dev
    else
        echo "To start manually, run: npm run dev"
    fi
fi
