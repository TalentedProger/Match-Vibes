# Generate valid Telegram webhook secret token
# Only allows: A-Z, a-z, 0-9, _, -

$allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
$tokenLength = 32

$token = -join (1..$tokenLength | ForEach-Object {
    $allowedChars[(Get-Random -Maximum $allowedChars.Length)]
})

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TELEGRAM WEBHOOK SECRET TOKEN" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host $token -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy this token and use it in:" -ForegroundColor White
Write-Host "1. .env.local file" -ForegroundColor Gray
Write-Host "2. Vercel Environment Variables" -ForegroundColor Gray
Write-Host ""
