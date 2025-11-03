# Script to deploy Appwrite Functions
# Run this after installing Appwrite CLI: npm install -g appwrite-cli

Write-Host "🚀 Deploying Appwrite Functions..." -ForegroundColor Cyan

# Check if appwrite CLI is installed
if (!(Get-Command appwrite -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Appwrite CLI not found!" -ForegroundColor Red
    Write-Host "Install it: npm install -g appwrite-cli" -ForegroundColor Yellow
    Write-Host "Then run: appwrite login" -ForegroundColor Yellow
    exit 1
}

# Navigate to project root
Set-Location $PSScriptRoot

# Deploy block-user function
Write-Host "`n📦 Deploying block-user function..." -ForegroundColor Green
Set-Location "appwrite-functions/block-user"
appwrite deploy function
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ block-user deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy block-user" -ForegroundColor Red
}

# Deploy manage-team-membership function
Write-Host "`n📦 Deploying manage-team-membership function..." -ForegroundColor Green
Set-Location "../manage-team-membership"
appwrite deploy function
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ manage-team-membership deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy manage-team-membership" -ForegroundColor Red
}

Set-Location $PSScriptRoot

Write-Host "`n🎉 Deployment complete!" -ForegroundColor Cyan
Write-Host "Don't forget to:" -ForegroundColor Yellow
Write-Host "1. Add APPWRITE_API_KEY to Environment Variables in Console" -ForegroundColor Yellow
Write-Host "2. Copy Function IDs and send them to update frontend" -ForegroundColor Yellow
