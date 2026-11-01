@echo off
echo ========================================================
echo   Starting IMovies - Movie Ticket Booking Platform
echo ========================================================
echo.

echo [1/2] Starting Backend Server (Port 5000)...
start "IMovies Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend App (Port 3000)...
start "IMovies Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ========================================================
echo   Application is now running!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:5000/api
echo ========================================================
echo Opening browser...
start http://localhost:3000

pause
