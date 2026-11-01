@echo off
echo ========================================================
echo   Pushing IMovies to GitHub (No Token Required)
echo   Repo: https://github.com/chiturahangdale4124-ops/IMovies.git
echo ========================================================
echo.

git branch -M main
git remote set-url origin https://github.com/chiturahangdale4124-ops/IMovies.git

echo Running git push...
echo (If a browser window opens, just click 'Authorize' - no token needed!)
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! Project has been pushed to GitHub!
    echo   View repo: https://github.com/chiturahangdale4124-ops/IMovies
    echo ========================================================
) else (
    echo.
    echo If it asked for credentials, you can authorize via browser.
)

echo.
pause
