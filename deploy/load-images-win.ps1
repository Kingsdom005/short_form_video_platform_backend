$ErrorActionPreference = "Stop"
$imgDir = Join-Path $PSScriptRoot "images"
if (!(Test-Path $imgDir)) {
  Write-Error "images directory not found: $imgDir"
}
Get-ChildItem $imgDir -Filter *.tar | ForEach-Object {
  Write-Host "Loading image $($_.FullName)"
  docker load -i $_.FullName
}
docker images
