#!/bin/bash

# Beer Management - Stop Database Script
# This script stops MongoDB and the backend server

echo "🛑 Stopping Beer Management services..."

# Stop backend server
if lsof -ti:5001 > /dev/null; then
    echo "🛑 Stopping backend server..."
    kill -9 $(lsof -ti:5001)
    echo "✅ Backend server stopped"
else
    echo "ℹ️  Backend server was not running"
fi

# Stop MongoDB
if pgrep -x "mongod" > /dev/null; then
    echo "🛑 Stopping MongoDB..."
    kill -9 $(pgrep -x "mongod")
    echo "✅ MongoDB stopped"
else
    echo "ℹ️  MongoDB was not running"
fi

echo ""
echo "🏁 All services stopped!"
echo "To start again, run: ./start-db.sh"
