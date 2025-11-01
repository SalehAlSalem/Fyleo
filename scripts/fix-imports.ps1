$ErrorActionPreference = 'Stop'

function Replace-InFile($path, $map) {
  $text = Get-Content $path -Raw
  $orig = $text
  foreach ($kv in $map.GetEnumerator()) {
    $text = $text -replace [Regex]::Escape($kv.Key), $kv.Value
  }
  if ($text -ne $orig) {
    Set-Content -Path $path -Value $text -Encoding UTF8
    Write-Host ("Updated: " + $path)
  }
}

$map = [ordered]@{
  # ModernComponents moves
  '../../components/modern/ModernComponents.jsx' = '@shared/ui/modern/ModernComponents.jsx'
  '../components/modern/ModernComponents.jsx'   = '@shared/ui/modern/ModernComponents.jsx'
  './components/modern/ModernComponents.jsx'    = '@shared/ui/modern/ModernComponents.jsx'
  'components/modern/ModernComponents.jsx'      = '@shared/ui/modern/ModernComponents.jsx'
  '../../components/modern/ModernComponents'    = '@shared/ui/modern/ModernComponents'
  '../components/modern/ModernComponents'       = '@shared/ui/modern/ModernComponents'
  './components/modern/ModernComponents'        = '@shared/ui/modern/ModernComponents'
  'components/modern/ModernComponents'          = '@shared/ui/modern/ModernComponents'

  # Other shared UI moves
  'components/LanguageSwitcher/LanguageSwitcher.jsx' = '@shared/ui/LanguageSwitcher/LanguageSwitcher.jsx'
  'components/CookieConsent/CookieConsentBanner.jsx' = '@shared/ui/CookieConsent/CookieConsentBanner.jsx'
  'components/CookieConsent/CookieConsentBanner.css' = '@shared/ui/CookieConsent/CookieConsentBanner.css'
  'components/LoadingScreen.jsx' = '@shared/ui/LoadingScreen.jsx'
  'components/ProtectedRoute.jsx' = '@shared/ui/ProtectedRoute.jsx'

  # Styles & i18n & lib
  './styles/globals.css'        = '@shared/styles/globals.css'
  '../styles/globals.css'       = '@shared/styles/globals.css'
  '../../styles/globals.css'    = '@shared/styles/globals.css'
  './styles/modern-globals.css'     = '@shared/styles/modern-globals.css'
  '../styles/modern-globals.css'    = '@shared/styles/modern-globals.css'
  '../../styles/modern-globals.css' = '@shared/styles/modern-globals.css'

  './i18n/config'  = '@shared/i18n/config'
  '../i18n/config' = '@shared/i18n/config'

  './lib/queryClient'  = '@lib/queryClient'
  '../lib/queryClient' = '@lib/queryClient'

  # Hooks to alias
  '../../../hooks/useAuth' = '@/hooks/useAuth'
  '../../hooks/useAuth'    = '@/hooks/useAuth'
  '../hooks/useAuth'       = '@/hooks/useAuth'
}

$files = Get-ChildItem -Path 'src' -Recurse -File -Include *.js,*.jsx,*.ts,*.tsx
foreach ($f in $files) { Replace-InFile -path $f.FullName -map $map }

Write-Host 'Fix imports completed.'
