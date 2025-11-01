# Build script for Appwrite Function
# Creates tar.gz file ready for upload

Write-Host "🔨 Building Appwrite Function..." -ForegroundColor Cyan

# Create temp directory
$tempDir = "temp-build"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy necessary files
Write-Host "📦 Copying files..." -ForegroundColor Yellow
Copy-Item "src" -Destination "$tempDir/src" -Recurse
Copy-Item "package.json" -Destination "$tempDir/"
Copy-Item "appwrite.json" -Destination "$tempDir/" -ErrorAction SilentlyContinue

# Create tar.gz
Write-Host "🗜️ Creating tar.gz..." -ForegroundColor Yellow
$outputFile = "delete-user-function.tar.gz"

# Use tar command (available in Windows 10+)
Set-Location $tempDir
tar -czf "../$outputFile" *
Set-Location ..

# Cleanup
Remove-Item -Recurse -Force $tempDir

Write-Host "✅ Build complete: $outputFile" -ForegroundColor Green
Write-Host ""
Write-Host "📤 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Appwrite Console → Functions" -ForegroundColor White
Write-Host "2. Create new Function" -ForegroundColor White
Write-Host "3. Upload: $outputFile" -ForegroundColor White
Write-Host "4. Set Runtime: Node.js 18+" -ForegroundColor White
Write-Host "5. Set Execute Access: Users" -ForegroundColor White
