#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

node -v
npm -v

cd "$BACKEND"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
nohup npm run start > "$ROOT/backend.log" 2>&1 &

cd "$FRONTEND"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
nohup npm run dev -- --host > "$ROOT/frontend.log" 2>&1 &

echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
