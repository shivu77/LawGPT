# PowerShell script to start the frontend development server
# Usage: .\start-dev.ps1

Write-Host "Starting LAW-GPT Frontend Development Server..." -ForegroundColor Cyan
Write-Host ""

# Change to frontend directory
Set-Location $PSScriptRoot

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
}

# Start the development server
Write-Host "Starting Vite development server on http://localhost:3001..." -ForegroundColor Green
npm run dev

