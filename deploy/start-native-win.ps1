$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

Write-Host "Checking Node.js..."
node -v
npm -v

Write-Host "Checking MySQL and Redis ports..."
try { Test-NetConnection 127.0.0.1 -Port 3306 | Out-Null } catch {}
try { Test-NetConnection 127.0.0.1 -Port 6379 | Out-Null } catch {}

Write-Host "Installing backend dependencies..."
Push-Location $backend
if (Test-Path package-lock.json) { npm ci } else { npm install }
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$backend`"; npm run start"
Pop-Location

Write-Host "Installing frontend dependencies..."
Push-Location $frontend
if (Test-Path package-lock.json) { npm ci } else { npm install }
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$frontend`"; npm run dev -- --host"
Pop-Location

Write-Host "Native services started."
Write-Host "Backend: http://localhost:3001"
Write-Host "Frontend: http://localhost:5173"
