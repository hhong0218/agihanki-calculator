# 아기한끼 계산기 — Cloudflare Pages 배포
# 사용: .\scripts\deploy.ps1

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

Write-Host "Deploying to Cloudflare Pages (agihanki-calculator)..." -ForegroundColor Cyan
npx wrangler pages deploy . --project-name=agihanki-calculator --branch=main --commit-dirty=true

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Live: https://agihanki.matchiq.co.kr" -ForegroundColor Green
  Write-Host "Git:  https://github.com/hhong0218/agihanki-calculator" -ForegroundColor Green
}