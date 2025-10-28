#!/bin/bash

# Beer Management - MongoDB Startup Script
# This script starts MongoDB and the backend server

echo "🍺 Starting Beer Management Database..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed!"
    echo "Please install MongoDB:"
    echo "  macOS: brew install mongodb-community"
    echo "  Ubuntu: sudo apt-get install mongodb"
    echo "  Or visit: https://docs.mongodb.com/manual/installation/"
    exit 1
fi

# Check if MongoDB is already running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is already running"
else
    echo "🚀 Starting MongoDB..."
    
    # Create data directory if it doesn't exist
    mkdir -p ./data/db
    
    # Start MongoDB
    mongod --dbpath ./data/db --port 27017 &
    
    # Wait a moment for MongoDB to start
    sleep 3
    
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB started successfully on port 27017"
    else
        echo "❌ Failed to start MongoDB"
        exit 1
    fi
fi

# Check if backend is already running
if lsof -ti:5001 > /dev/null; then
    echo "✅ Backend server is already running on port 5001"
else
    echo "🚀 Starting backend server..."
    cd backend
    npm run dev &
    cd ..
    sleep 2
    echo "✅ Backend server started on port 5001"
fi

echo ""
echo "🎉 Beer Management is ready!"
echo "📊 Database: MongoDB on port 27017"
echo "🔧 Backend API: http://localhost:5001"
echo "🌐 Frontend: http://localhost:5174"
echo ""
echo "To stop all services, run: ./stop-db.sh"
echo "To view logs, run: ./logs.sh"
