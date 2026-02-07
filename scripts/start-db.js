#!/usr/bin/env node

/**
 * Beer Management - MongoDB Startup Script (Node.js)
 * Starts MongoDB and backend server with proper process detachment
 * so they continue running after this script exits.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'data', 'db');
const BACKEND_DIR = path.join(PROJECT_ROOT, 'backend');

function sleep(ms) 
{
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isMongoRunning() 
{
  try 
  {
    execSync('pgrep -x mongod', { encoding: 'utf8' });
    return true;
  }
  catch 
  {
    return false;
  }
}

function isBackendRunning() 
{
  try 
  {
    execSync('lsof -ti:5001', { encoding: 'utf8' });
    return true;
  }
  catch 
  {
    return false;
  }
}

function log(msg) 
{
  console.log(msg);
}

// Check if MongoDB is installed
function checkMongoInstalled() 
{
  try 
  {
    execSync('which mongod', { encoding: 'utf8' });
    return true;
  }
  catch 
  {
    return false;
  }
}

async function main() 
{
  log('🍺 Starting Beer Management Database...');

  if (!checkMongoInstalled()) 
  {
    log('❌ MongoDB is not installed!');
    log('Please install MongoDB:');
    log('  macOS: brew install mongodb-community');
    log('  Ubuntu: sudo apt-get install mongodb');
    log('  Or visit: https://docs.mongodb.com/manual/installation/');
    process.exit(1);
  }

  if (isMongoRunning()) 
  {
    log('✅ MongoDB is already running');
  }
  else 
  {
    log('🚀 Starting MongoDB...');

    if (!fs.existsSync(DATA_DIR)) 
    {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const mongod = spawn('mongod', ['--dbpath', DATA_DIR, '--port', '27017'], {
      cwd: PROJECT_ROOT,
      detached: true,
      stdio: 'ignore',
    });

    mongod.unref();

    // Wait for MongoDB to start
    let attempts = 0;
    const maxAttempts = 15;
    while (attempts < maxAttempts) 
    {
      await sleep(500);
      if (isMongoRunning()) 
      {
        log('✅ MongoDB started successfully on port 27017');
        break;
      }
      attempts++;
      if (attempts >= maxAttempts) 
      {
        log('❌ Failed to start MongoDB');
        process.exit(1);
      }
    }
  }

  if (isBackendRunning()) 
  {
    log('✅ Backend server is already running on port 5001');
  }
  else 
  {
    log('🚀 Starting backend server...');

    const isWindows = process.platform === 'win32';
    const backend = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
      cwd: BACKEND_DIR,
      detached: true,
      stdio: 'ignore',
      env: { ...process.env },
    });

    backend.unref();

    await sleep(2000);
    log('✅ Backend server started on port 5001');
  }

  log('');
  log('🎉 Beer Management is ready!');
  log('📊 Database: MongoDB on port 27017');
  log('🔧 Backend API: http://localhost:5001');
  log('🌐 Frontend: http://localhost:5174');
  log('');
  log('To stop all services, run: npm run stop-db');
  log('To view status, run: npm run status');
}

main().catch((err) => 
{
  console.error(err);
  process.exit(1);
});
