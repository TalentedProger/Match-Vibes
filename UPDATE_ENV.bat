@echo off
echo Updating .env.local with localtunnel URL...
powershell -Command "(Get-Content .env.local) -replace 'NEXT_PUBLIC_APP_URL=.*', 'NEXT_PUBLIC_APP_URL=https://busy-suns-tease.loca.lt' | Set-Content .env.local"
echo Done! Now run: pnpm bot:menu
pause
