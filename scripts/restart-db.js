#!/usr/bin/env node

/**
 * Beer Management - Restart Database Script (Node.js)
 * Stops and restarts MongoDB and the backend server
 */

const { spawn } = require('child_process');
const path = require('path');

const scriptsDir = path.resolve(__dirname);

function runScript(scriptName) 
{
  return new Promise((resolve, reject) => 
  {
    const child = spawn('node', [path.join(scriptsDir, `${scriptName}.js`)], {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    });
    child.on('close', (code) => 
    {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} exited with code ${code}`));
    });
  });
}

async function main() 
{
  console.log('🔄 Restarting Beer Management services...');

  console.log('🛑 Stopping all services...');
  await runScript('stop-db');

  console.log('⏳ Waiting for cleanup...');
  await new Promise((r) => setTimeout(r, 3000));

  console.log('🚀 Starting all services...');
  await runScript('start-db');

  console.log('');
  console.log('✅ Restart complete!');
}

main().catch((err) => 
{
  console.error(err);
  process.exit(1);
});
