# Script to package Appwrite Functions as tar.gz files for deployment
# This prepares the functions for manual upload to Appwrite Console

Write-Host "📦 Packaging Appwrite Functions..." -ForegroundColor Cyan

# Check if tar is available
if (!(Get-Command tar -ErrorAction SilentlyContinue)) {
    Write-Host "❌ tar command not found!" -ForegroundColor Red
    Write-Host "Make sure you're using Windows 10+ or install tar" -ForegroundColor Yellow
    exit 1
}

# Create output directory for packaged functions
$outputDir = "appwrite-functions-packaged"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Write-Host "📁 Output directory: $outputDir" -ForegroundColor Gray

# Package block-user function
Write-Host "`n📦 Packaging block-user function..." -ForegroundColor Green
$blockUserDir = "appwrite-functions/block-user"
if (Test-Path $blockUserDir) {
    Set-Location $blockUserDir
    tar -czf "../../$outputDir/block-user.tar.gz" src package.json appwrite.json 2>$null
    Set-Location ../..
    
    if (Test-Path "$outputDir/block-user.tar.gz") {
        $size = (Get-Item "$outputDir/block-user.tar.gz").Length / 1KB
        Write-Host "✅ block-user.tar.gz created ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create block-user.tar.gz" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Directory not found: $blockUserDir" -ForegroundColor Red
}

# Package manage-team-membership function
Write-Host "`n📦 Packaging manage-team-membership function..." -ForegroundColor Green
$teamMembershipDir = "appwrite-functions/manage-team-membership"
if (Test-Path $teamMembershipDir) {
    Set-Location $teamMembershipDir
    tar -czf "../../$outputDir/manage-team-membership.tar.gz" src package.json appwrite.json 2>$null
    Set-Location ../..
    
    if (Test-Path "$outputDir/manage-team-membership.tar.gz") {
        $size = (Get-Item "$outputDir/manage-team-membership.tar.gz").Length / 1KB
        Write-Host "✅ manage-team-membership.tar.gz created ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create manage-team-membership.tar.gz" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Directory not found: $teamMembershipDir" -ForegroundColor Red
}

Write-Host "`n🎉 Packaging complete!" -ForegroundColor Cyan
Write-Host "`n📂 Files ready for upload:" -ForegroundColor Yellow
Write-Host "   - $outputDir/block-user.tar.gz" -ForegroundColor White
Write-Host "   - $outputDir/manage-team-membership.tar.gz" -ForegroundColor White

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://cloud.appwrite.io/console/project-68d9740b0012416cb71b/functions" -ForegroundColor White
Write-Host "2. Create Function → Manual deployment" -ForegroundColor White
Write-Host "3. Upload the .tar.gz files" -ForegroundColor White
Write-Host "4. Add APPWRITE_API_KEY to Environment Variables" -ForegroundColor White
Write-Host "5. Copy Function IDs and send them to update frontend" -ForegroundColor White

Write-Host "`n💡 Tip: You can also use 'Invoke-Item $outputDir' to open the folder" -ForegroundColor Gray
