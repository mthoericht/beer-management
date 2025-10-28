#!/bin/bash

# Beer Management - Restart Database Script
# This script stops and restarts MongoDB and the backend server

echo "🔄 Restarting Beer Management services..."

# Stop all services first
echo "🛑 Stopping all services..."
./stop-db.sh

# Wait a moment for cleanup
echo "⏳ Waiting for cleanup..."
sleep 3

# Start all services
echo "🚀 Starting all services..."
./start-db.sh

echo ""
echo "✅ Restart complete!"
