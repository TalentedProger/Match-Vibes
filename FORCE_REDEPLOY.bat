@echo off
echo ========================================
echo Force Redeploy to Vercel
echo ========================================
echo.
echo This will create an empty commit and push to trigger Vercel deploy
echo.
pause

echo.
echo Creating empty commit...
git commit --allow-empty -m "deploy: форсированный редеплой для исправления 404"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo Check Vercel Dashboard for new deployment:
echo https://vercel.com/dashboard
echo.
pause
