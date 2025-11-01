$ErrorActionPreference = 'Stop'

Write-Host '--- Phase 0: Ensure target folders exist ---'
$dirs = @(
  'src/app',
  'src/shared/ui',
  'src/shared/ui/modern',
  'src/shared/ui/LanguageSwitcher',
  'src/shared/ui/CookieConsent',
  'src/shared/styles',
  'src/shared/i18n',
  'src/shared/lib'
)
foreach ($d in $dirs) { if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d | Out-Null; Write-Host "Created: $d" } }

function MoveSafe($from,$to){
  if (Test-Path $from) {
    $toDir = Split-Path -Parent $to
    if (-not (Test-Path $toDir)) { New-Item -ItemType Directory -Path $toDir | Out-Null }
    Move-Item -Path $from -Destination $to -Force
    Write-Host ("Moved: " + $from + " -> " + $to)
  } else {
    Write-Host ("Skip missing: " + $from)
  }
}

Write-Host '--- Phase 1: Move files ---'
# Core
MoveSafe 'src/App.jsx' 'src/app/App.jsx'
MoveSafe 'src/main.jsx' 'src/app/main.jsx'

# Modern UI
MoveSafe 'src/components/modern/ModernComponents.jsx' 'src/shared/ui/modern/ModernComponents.jsx'
MoveSafe 'src/components/modern/ModernNavbar.jsx' 'src/shared/ui/modern/ModernNavbar.jsx'
MoveSafe 'src/components/modern/ModernNavbar.css' 'src/shared/ui/modern/ModernNavbar.css'
MoveSafe 'src/components/modern/ModernFooter.jsx' 'src/shared/ui/modern/ModernFooter.jsx'

# LanguageSwitcher (i18n-based)
MoveSafe 'src/components/LanguageSwitcher/LanguageSwitcher.jsx' 'src/shared/ui/LanguageSwitcher/LanguageSwitcher.jsx'

# Cookie Consent
MoveSafe 'src/components/CookieConsent/CookieConsentBanner.jsx' 'src/shared/ui/CookieConsent/CookieConsentBanner.jsx'
MoveSafe 'src/components/CookieConsent/CookieConsentBanner.css' 'src/shared/ui/CookieConsent/CookieConsentBanner.css'

# Utilities
MoveSafe 'src/components/LoadingScreen.jsx' 'src/shared/ui/LoadingScreen.jsx'
MoveSafe 'src/components/ProtectedRoute.jsx' 'src/shared/ui/ProtectedRoute.jsx'

# Styles
MoveSafe 'src/styles/globals.css' 'src/shared/styles/globals.css'
MoveSafe 'src/styles/modern-globals.css' 'src/shared/styles/modern-globals.css'
MoveSafe 'src/styles/Monument.css' 'src/shared/styles/Monument.css'
MoveSafe 'src/styles/fonts.css' 'src/shared/styles/fonts.css'
MoveSafe 'src/styles/navbar.css' 'src/shared/styles/navbar.css'
MoveSafe 'src/styles/scrollbar.css' 'src/shared/styles/scrollbar.css'

# i18n & lib
MoveSafe 'src/i18n/config.js' 'src/shared/i18n/config.js'
MoveSafe 'src/lib/queryClient.ts' 'src/shared/lib/queryClient.ts'

Write-Host '--- Phase 2: Update index.html entry script ---'
if (Test-Path 'index.html') {
  $html = Get-Content 'index.html' -Raw
  $new = $html -replace '/src/main\.jsx','/src/app/main.jsx'
  if ($new -ne $html) { Set-Content -Path 'index.html' -Value $new -Encoding UTF8; Write-Host 'index.html updated' }
  else { Write-Host 'index.html already up-to-date' }
}

Write-Host '--- Phase 3: Update tsconfig paths ---'
$tsPath = 'tsconfig.json'
if (Test-Path $tsPath) {
  $json = Get-Content $tsPath -Raw | ConvertFrom-Json
  if (-not $json.compilerOptions.paths.'@/*')       { $json.compilerOptions.paths.'@/*'       = @('./src/*') }
  if (-not $json.compilerOptions.paths.'@app/*')     { $json.compilerOptions.paths.'@app/*'     = @('./src/app/*') }
  if (-not $json.compilerOptions.paths.'@shared/*')  { $json.compilerOptions.paths.'@shared/*'  = @('./src/shared/*') }
  if (-not $json.compilerOptions.paths.'@features/*'){ $json.compilerOptions.paths.'@features/*'= @('./src/features/*') }
  if (-not $json.compilerOptions.paths.'@services/*'){ $json.compilerOptions.paths.'@services/*'= @('./src/services/*') }
  if (-not $json.compilerOptions.paths.'@config/*')  { $json.compilerOptions.paths.'@config/*'  = @('./src/config/*') }
  if (-not $json.compilerOptions.paths.'@types/*')   { $json.compilerOptions.paths.'@types/*'   = @('./src/types/*') }
  $json.compilerOptions.paths.'@/lib/*' = @('./src/shared/lib/*','./src/lib/*')
  if (-not $json.compilerOptions.paths.'@/pages/*')  { $json.compilerOptions.paths.'@/pages/*'  = @('./src/pages/*') }
  $json | ConvertTo-Json -Depth 100 | Set-Content -Path $tsPath -Encoding UTF8
  Write-Host 'tsconfig.json updated'
}

Write-Host '--- Phase 4: Patch vite.config.js aliases ---'
$vitePath = 'vite.config.js'
if (Test-Path $vitePath) {
  $vite = Get-Content $vitePath -Raw
  if ($vite -notmatch 'resolve:\s*\{') {
    $alias = @"
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@shared': '/src/shared',
      '@features': '/src/features',
      '@services': '/src/services',
      '@config': '/src/config',
      '@types': '/src/types',
      '@lib': '/src/shared/lib'
    }
  },
"@
    $vite = $vite -replace "plugins:\s*\[react\(\)\],","plugins: [react()],`r`n$alias"
    Set-Content -Path $vitePath -Value $vite -Encoding UTF8
    Write-Host 'vite.config.js aliases added'
  } else {
    Write-Host 'vite.config.js already has resolve.alias (skipped)'
  }
}

Write-Host '--- Phase 5: Global import replacements ---'
function Replace-InFile($path, $map) {
  $text = Get-Content $path -Raw
  $orig = $text
  foreach ($kv in $map.GetEnumerator()) {
    $text = $text -replace [Regex]::Escape($kv.Key), $kv.Value
  }
  if ($text -ne $orig) { Set-Content -Path $path -Value $text -Encoding UTF8; Write-Host ("Updated: " + $path) }
}

$map = [ordered]@{
  'components/modern/ModernComponents.jsx' = '@shared/ui/modern/ModernComponents.jsx'
  'components/modern/ModernComponents'     = '@shared/ui/modern/ModernComponents'
  '../modern/ModernComponents.jsx'         = '@shared/ui/modern/ModernComponents.jsx'
  '../modern/ModernComponents'             = '@shared/ui/modern/ModernComponents'
  './modern/ModernComponents.jsx'          = '@shared/ui/modern/ModernComponents.jsx'
  './modern/ModernComponents'              = '@shared/ui/modern/ModernComponents'

  'components/modern/ModernNavbar.jsx'     = '@shared/ui/modern/ModernNavbar.jsx'
  'components/modern/ModernFooter.jsx'     = '@shared/ui/modern/ModernFooter.jsx'
  'components/LanguageSwitcher/LanguageSwitcher.jsx' = '@shared/ui/LanguageSwitcher/LanguageSwitcher.jsx'

  'components/CookieConsent/CookieConsentBanner.jsx' = '@shared/ui/CookieConsent/CookieConsentBanner.jsx'
  'components/CookieConsent/CookieConsentBanner.css' = '@shared/ui/CookieConsent/CookieConsentBanner.css'
  'components/LoadingScreen.jsx' = '@shared/ui/LoadingScreen.jsx'
  'components/ProtectedRoute.jsx' = '@shared/ui/ProtectedRoute.jsx'

  'styles/globals.css'         = '@shared/styles/globals.css'
  'styles/modern-globals.css'  = '@shared/styles/modern-globals.css'
  'styles/Monument.css'        = '@shared/styles/Monument.css'
  'styles/fonts.css'           = '@shared/styles/fonts.css'
  'styles/navbar.css'          = '@shared/styles/navbar.css'
  'styles/scrollbar.css'       = '@shared/styles/scrollbar.css'

  'i18n/config'                = '@shared/i18n/config'
  'lib/queryClient'            = '@lib/queryClient'

  '../contexts/LanguageContext'   = '@/contexts/LanguageContext'
  '../../contexts/LanguageContext' = '@/contexts/LanguageContext'
  '../../../contexts/LanguageContext' = '@/contexts/LanguageContext'

  '../hooks/useAuth' = '@/hooks/useAuth'
  '../../hooks/useAuth' = '@/hooks/useAuth'
  '../../../hooks/useAuth' = '@/hooks/useAuth'
}

$codeFiles = Get-ChildItem -Path 'src' -Recurse -File -Include *.js,*.jsx,*.ts,*.tsx
foreach ($f in $codeFiles) { Replace-InFile -path $f.FullName -map $map }

Write-Host '--- Phase 6: File-specific fixes (App.jsx, main.jsx) ---'
$appNew = 'src/app/App.jsx'
if (Test-Path $appNew) {
  $txt = Get-Content $appNew -Raw
  $txt = $txt -replace "from\s+'\./components/modern/ModernComponents\.jsx'", "from '@shared/ui/modern/ModernComponents.jsx'"
  $txt = $txt -replace "from\s+'\./components/modern/ModernNavbar\.jsx'", "from '@shared/ui/modern/ModernNavbar.jsx'"
  $txt = $txt -replace "from\s+'\./components/modern/ModernFooter\.jsx'", "from '@shared/ui/modern/ModernFooter.jsx'"
  $txt = $txt -replace "from\s+'\./components/LoadingScreen\.jsx'", "from '@shared/ui/LoadingScreen.jsx'"
  $txt = $txt -replace "from\s+'\./components/ProtectedRoute\.jsx'", "from '@shared/ui/ProtectedRoute.jsx'"
  $txt = $txt -replace "from\s+'\./components/CookieConsent/CookieConsentBanner\.jsx'", "from '@shared/ui/CookieConsent/CookieConsentBanner.jsx'"
  $txt = $txt -replace "from\s+'\./features/", "from '@features/"
  $txt = $txt -replace "from\s+'\./pages/", "from '@/pages/"
  $txt = $txt -replace "from\s+'\./hooks/", "from '@/hooks/"
  $txt = $txt -replace "from\s+'\./services/", "from '@services/"
  Set-Content -Path $appNew -Value $txt -Encoding UTF8
  Write-Host 'Patched src/app/App.jsx imports'
}

$mainNew = 'src/app/main.jsx'
if (Test-Path $mainNew) {
  $txt = Get-Content $mainNew -Raw
  $txt = $txt -replace "from\s+'\./App\.jsx'", "from '@app/App.jsx'"
  $txt = $txt -replace "components/modern/ModernComponents\.jsx", "@shared/ui/modern/ModernComponents.jsx"
  $txt = $txt -replace "\./lib/queryClient", "@lib/queryClient"
  $txt = $txt -replace "\./i18n/config", "@shared/i18n/config"
  $txt = $txt -replace "\./styles/", "@shared/styles/"
  Set-Content -Path $mainNew -Value $txt -Encoding UTF8
  Write-Host 'Patched src/app/main.jsx imports'
}

Write-Host '--- All done. ---'
