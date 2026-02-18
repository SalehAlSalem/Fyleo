# سكريبت فحص PocketBase
# PowerShell Script

$baseUrl = "https://pocketbase97.mooo.com"
$email = "salehbawaneh@gmail.com"
$password = "Bawa3neh.2000"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   فحص PocketBase Server" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 1. فحص الاتصال
Write-Host "`n[1] فحص الاتصال..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "$baseUrl/api/health" -UseBasicParsing
    $healthData = $health.Content | ConvertFrom-Json
    Write-Host "✅ السيرفر شغال" -ForegroundColor Green
    Write-Host "   الرسالة: $($healthData.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ خطأ في الاتصال" -ForegroundColor Red
    exit
}

# 2. تسجيل دخول Admin
Write-Host "`n[2] تسجيل دخول Admin..." -ForegroundColor Yellow
$loginBody = @{
    identity = $email
    password = $password
} | ConvertTo-Json

try {
    $authResponse = Invoke-WebRequest -Uri "$baseUrl/api/admins/auth-with-password" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $authData = $authResponse.Content | ConvertFrom-Json
    $token = $authData.token
    Write-Host "✅ تم تسجيل الدخول بنجاح" -ForegroundColor Green
    Write-Host "   Admin: $($authData.admin.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ خطأ في تسجيل الدخول: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 3. جلب Collections
Write-Host "`n[3] جلب Collections..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $collectionsResponse = Invoke-WebRequest -Uri "$baseUrl/api/collections" `
        -Headers $headers `
        -UseBasicParsing
    
    $collectionsData = $collectionsResponse.Content | ConvertFrom-Json
    $collections = $collectionsData.items
    
    Write-Host "✅ تم جلب Collections" -ForegroundColor Green
    Write-Host "`n==================================" -ForegroundColor Cyan
    Write-Host "   Collections الموجودة ($($collections.Count))" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    
    foreach ($col in $collections) {
        Write-Host "`n📦 $($col.name)" -ForegroundColor Magenta
        Write-Host "   ID: $($col.id)" -ForegroundColor Gray
        Write-Host "   النوع: $($col.type)" -ForegroundColor Gray
        Write-Host "   النظام: $($col.system)" -ForegroundColor Gray
        
        if ($col.schema -and $col.schema.Count -gt 0) {
            Write-Host "   الحقول ($($col.schema.Count)):" -ForegroundColor Yellow
            foreach ($field in $col.schema) {
                Write-Host "      - $($field.name) [$($field.type)]" -ForegroundColor Gray
            }
        } else {
            Write-Host "   لا توجد حقول إضافية" -ForegroundColor Gray
        }
        
        # جلب عدد السجلات
        try {
            $recordsResponse = Invoke-WebRequest -Uri "$baseUrl/api/collections/$($col.name)/records?perPage=1" `
                -Headers $headers `
                -UseBasicParsing
            $recordsData = $recordsResponse.Content | ConvertFrom-Json
            Write-Host "   عدد السجلات: $($recordsData.totalItems)" -ForegroundColor Cyan
        } catch {
            Write-Host "   عدد السجلات: لا يمكن الوصول" -ForegroundColor Red
        }
    }
    
    # 4. فحص CORS Settings
    Write-Host "`n==================================" -ForegroundColor Cyan
    Write-Host "   ملخص الفحص" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "✅ السيرفر: شغال" -ForegroundColor Green
    Write-Host "✅ Admin: متصل" -ForegroundColor Green
    Write-Host "📊 Collections: $($collections.Count)" -ForegroundColor Yellow
    
    $userCollections = $collections | Where-Object { $_.type -eq "auth" }
    $baseCollections = $collections | Where-Object { $_.type -eq "base" }
    
    Write-Host "   - Auth Collections: $($userCollections.Count)" -ForegroundColor Gray
    Write-Host "   - Base Collections: $($baseCollections.Count)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ خطأ في جلب Collections: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "تم الانتهاء!" -ForegroundColor Green
