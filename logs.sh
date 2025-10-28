#!/bin/bash

# Beer Management - View Logs Script
# This script shows logs for MongoDB and backend

echo "📋 Beer Management Logs"
echo "========================"

# Show MongoDB logs
if pgrep -x "mongod" > /dev/null; then
    echo "📊 MongoDB Status: ✅ Running (PID: $(pgrep -x "mongod"))"
else
    echo "📊 MongoDB Status: ❌ Not running"
fi

# Show backend logs
if lsof -ti:5001 > /dev/null; then
    echo "🔧 Backend Status: ✅ Running (PID: $(lsof -ti:5001))"
else
    echo "🔧 Backend Status: ❌ Not running"
fi

echo ""
echo "🌐 Frontend Status: Check http://localhost:5174"
echo "📊 Database URL: mongodb://localhost:27017/beer-management"
echo "🔧 API URL: http://localhost:5001/api"

echo ""
echo "To start services: ./start-db.sh"
echo "To stop services: ./stop-db.sh"
