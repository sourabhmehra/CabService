@echo off
REM Start the Next.js frontend (Windows)
cd /d "%~dp0frontend"
if not exist node_modules (
  echo Installing npm packages...
  call npm install
)
echo Starting Next.js on http://localhost:3000 ...
call npm run dev
