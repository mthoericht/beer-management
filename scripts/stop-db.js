#!/usr/bin/env node

/**
 * Beer Management - Stop Database Script (Node.js)
 * Stops MongoDB and the backend server
 */

const { execSync } = require('child_process');

function log(msg) 
{
  console.log(msg);
}

function killBackend() 
{
  try 
  {
    const pids = execSync('lsof -ti:5001', { encoding: 'utf8' }).trim();
    if (pids) 
    {
      execSync(`kill -9 ${pids}`);
      return true;
    }
  }
  catch 
  {
    // Port not in use
  }
  return false;
}

function killMongo() 
{
  try 
  {
    const pids = execSync('pgrep -x mongod', { encoding: 'utf8' }).trim();
    if (pids) 
    {
      execSync(`kill -9 ${pids}`);
      return true;
    }
  }
  catch 
  {
    // MongoDB not running
  }
  return false;
}

log('🛑 Stopping Beer Management services...');

if (killBackend()) 
{
  log('✅ Backend server stopped');
}
else 
{
  log('ℹ️  Backend server was not running');
}

if (killMongo()) 
{
  log('✅ MongoDB stopped');
}
else 
{
  log('ℹ️  MongoDB was not running');
}

log('');
log('🏁 All services stopped!');
log('To start again, run: npm run start-db');
