param(
  [string]$BackendPath = "..\backend"
)

$ErrorActionPreference = "Stop"

function Write-Info($msg) {
  Write-Host "[INFO] $msg" -ForegroundColor Cyan
}

function Write-Ok($msg) {
  Write-Host "[OK] $msg" -ForegroundColor Green
}

function Write-WarnMsg($msg) {
  Write-Host "[WARN] $msg" -ForegroundColor Yellow
}

$BackendFullPath = Resolve-Path $BackendPath
Write-Info "Backend path: $BackendFullPath"

$backupDir = Join-Path $BackendFullPath "_backup_before_nanoid_fix"
if (!(Test-Path $backupDir)) {
  New-Item -ItemType Directory -Path $backupDir | Out-Null
  Write-Info "Created backup directory: $backupDir"
}

$files = Get-ChildItem -Path $BackendFullPath -Recurse -File -Include *.js,*.cjs,*.mjs |
  Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\_backup_before_nanoid_fix\\" }

$changed = 0

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  $original = $content

  $needsFix = $false
  if ($content -match "require\('nanoid'\)" -or $content -match 'require\("nanoid"\)' -or $content -match '\bnanoid\s*\(') {
    $needsFix = $true
  }

  if (-not $needsFix) { continue }

  # Backup original
  $relative = $file.FullName.Substring($BackendFullPath.Path.Length).TrimStart('\')
  $backupFile = Join-Path $backupDir $relative
  $backupParent = Split-Path $backupFile -Parent
  if (!(Test-Path $backupParent)) {
    New-Item -ItemType Directory -Path $backupParent -Force | Out-Null
  }
  Set-Content -Path $backupFile -Value $original -Encoding UTF8

  # Replace common require forms
  $content = $content -replace "const\s*\{\s*nanoid\s*\}\s*=\s*require\('nanoid'\);", "const { randomUUID } = require('node:crypto');"
  $content = $content -replace 'const\s*\{\s*nanoid\s*\}\s*=\s*require\("nanoid"\);', "const { randomUUID } = require('node:crypto');"
  $content = $content -replace "let\s*\{\s*nanoid\s*\}\s*=\s*require\('nanoid'\);", "let { randomUUID } = require('node:crypto');"
  $content = $content -replace 'let\s*\{\s*nanoid\s*\}\s*=\s*require\("nanoid"\);', "let { randomUUID } = require('node:crypto');"
  $content = $content -replace "var\s*\{\s*nanoid\s*\}\s*=\s*require\('nanoid'\);", "var { randomUUID } = require('node:crypto');"
  $content = $content -replace 'var\s*\{\s*nanoid\s*\}\s*=\s*require\("nanoid"\);', "var { randomUUID } = require('node:crypto');"

  # Replace default require forms
  $content = $content -replace "const\s+nanoid\s*=\s*require\('nanoid'\);", "const { randomUUID } = require('node:crypto');"
  $content = $content -replace 'const\s+nanoid\s*=\s*require\("nanoid"\);', "const { randomUUID } = require('node:crypto');"

  # Replace usages
  $content = [regex]::Replace($content, '\bnanoid\s*\(\s*\)', 'randomUUID()')

  # Ensure import exists if randomUUID used but import missing
  if ($content -match '\brandomUUID\s*\(' -and $content -notmatch "require\('node:crypto'\)" -and $content -notmatch 'require\("node:crypto"\)') {
    $content = "const { randomUUID } = require('node:crypto');`r`n" + $content
  }

  if ($content -ne $original) {
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    $changed++
    Write-Ok "Patched: $relative"
  } else {
    Write-WarnMsg "No textual changes applied, but file matched pattern: $relative"
  }
}

Write-Info "Total changed files: $changed"

Write-Info "Optional cleanup:"
Write-Host "cd $BackendFullPath"
Write-Host "npm uninstall nanoid"
Write-Host "npm start"
