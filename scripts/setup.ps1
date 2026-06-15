# PowerShell setup helper for TickTime
# Usage: .\scripts\setup.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "TickTime setup" -ForegroundColor Cyan
Write-Host ""

$configPath = Join-Path $Root "src\pkjs\config.js"
$examplePath = Join-Path $Root "src\pkjs\config.example.js"

if (-not (Test-Path $configPath)) {
  Copy-Item $examplePath $configPath
  Write-Host "Created src/pkjs/config.js from example." -ForegroundColor Green
} else {
  Write-Host "src/pkjs/config.js already exists." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next — fill in src/pkjs/config.js:" -ForegroundColor Cyan
Write-Host "  CLIENT_ID      from https://developer.ticktick.com/manage"
Write-Host "  CLIENT_SECRET  from the same page"
Write-Host "  REDIRECT_URI   your GitHub Pages URL, e.g.:"
Write-Host "                 https://YOUR_GITHUB_USERNAME.github.io/ticktime-pebble/"
Write-Host ""

if (-not (Test-Path (Join-Path $Root "node_modules"))) {
  Write-Host "Installing npm dependencies..." -ForegroundColor Cyan
  Push-Location $Root
  npm install
  Pop-Location
  Write-Host "npm install complete." -ForegroundColor Green
} else {
  Write-Host "node_modules already present." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "GitHub Pages:" -ForegroundColor Cyan
Write-Host "  1. Create repo 'ticktime-pebble' on GitHub"
Write-Host "  2. Push this folder"
Write-Host "  3. Settings → Pages → Source: GitHub Actions"
Write-Host "  4. Use the Pages URL as REDIRECT_URI in TickTick + config.js"
Write-Host ""
Write-Host "CloudPebble:" -ForegroundColor Cyan
Write-Host "  https://cloudpebble.repebble.com - New Alloy project (emery)"
Write-Host "  Import this folder or connect the GitHub repo"
Write-Host ""
