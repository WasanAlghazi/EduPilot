@echo off
chcp 65001 >nul
title EduPilot
color 0B
cd /d "%~dp0"

echo.
echo ============================================================
echo                  EduPilot - Senior Project
echo ============================================================
echo.

REM ----- 1) Locate Python (try both 'python' and 'py') -----
echo [1/4] Locating Python...
set PYCMD=
where python >nul 2>&1
if not errorlevel 1 set PYCMD=python
if "%PYCMD%"=="" (
  where py >nul 2>&1
  if not errorlevel 1 set PYCMD=py
)

if "%PYCMD%"=="" (
  echo.
  echo  X  Python is NOT installed or not in PATH.
  echo.
  echo  Please install Python from: https://www.python.org/downloads/
  echo  Make sure to CHECK the box "Add Python to PATH" during install.
  echo.
  pause
  exit /b 1
)

%PYCMD% --version
echo  OK  Python found as "%PYCMD%".
echo.

REM ----- 2) Install backend dependencies -----
echo [2/4] Installing backend dependencies (~1 min on first run)...
cd backend
%PYCMD% -m pip install --quiet --disable-pip-version-check -r requirements.txt
set INSTALL_ERR=%errorlevel%
cd ..

if %INSTALL_ERR% NEQ 0 (
  echo.
  echo  !  Backend dependencies failed to install ^(no internet?^)
  echo  !  Falling back to FRONTEND-ONLY mode...
  echo.
  goto FRONTEND_ONLY
)

echo  OK  All dependencies installed.
echo.

REM ----- 3) Start the FULL server (Python + Frontend) -----
echo [3/4] Starting EduPilot full server...
echo.
echo   - Open in browser:  http://127.0.0.1:8000/
echo   - API:              http://127.0.0.1:8000/api/dashboard
echo.
echo   Press Ctrl+C to stop the server.
echo ============================================================
echo.

start "" cmd /c "timeout /t 4 /nobreak >nul & start http://127.0.0.1:8000/"
cd backend
%PYCMD% app.py
cd ..

echo.
echo [4/4] Server stopped.
pause
exit /b 0

:FRONTEND_ONLY
echo [3/4] Starting frontend-only server (offline mode)...
echo.
echo   - Open in browser:  http://127.0.0.1:5500/
echo   - Embedded data will be used (no Python AI engine).
echo.
echo   Press Ctrl+C to stop.
echo ============================================================
echo.

start "" cmd /c "timeout /t 4 /nobreak >nul & start http://127.0.0.1:5500/"
cd dist
%PYCMD% -m http.server 5500
cd ..

echo.
echo [4/4] Server stopped.
pause
