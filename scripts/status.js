#!/usr/bin/env node

/**
 * Beer Management - Status Script (Node.js)
 * Shows status of MongoDB and backend server
 */

const { execSync } = require('child_process');

function log(msg) 
{
  console.log(msg);
}

function getMongoStatus() 
{
  try 
  {
    const pid = execSync('pgrep -x mongod', { encoding: 'utf8' }).trim();
    return { running: true, pid };
  }
  catch 
  {
    return { running: false };
  }
}

function getBackendStatus() 
{
  try 
  {
    const pid = execSync('lsof -ti:5001', { encoding: 'utf8' }).trim();
    return { running: true, pid };
  }
  catch 
  {
    return { running: false };
  }
}

log('📋 Beer Management Logs');
log('========================');

const mongoStatus = getMongoStatus();
if (mongoStatus.running) 
{
  log(`📊 MongoDB Status: ✅ Running (PID: ${mongoStatus.pid})`);
}
else 
{
  log('📊 MongoDB Status: ❌ Not running');
}

const backendStatus = getBackendStatus();
if (backendStatus.running) 
{
  log(`🔧 Backend Status: ✅ Running (PID: ${backendStatus.pid})`);
}
else 
{
  log('🔧 Backend Status: ❌ Not running');
}

log('');
log('🌐 Frontend Status: Check http://localhost:5174');
log('📊 Database URL: mongodb://localhost:27017/beer-management');
log('🔧 API URL: http://localhost:5001/api');
log('');
log('To start services: npm run start-db');
log('To stop services: npm run stop-db');
