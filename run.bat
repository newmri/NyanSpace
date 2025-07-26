@echo off
setlocal enabledelayedexpansion

if "%1"=="" (
  echo Usage: run.bat [start^|stop^|push]
  goto end
)

if /I "%1"=="start" (
  echo Running in local mode...
  copy /Y client\.env.local client\.env >nul
  docker compose up --build -d
  goto end
)

if /I "%1"=="stop" (
  echo Stopping containers...
  docker compose down
  goto end
)

if /I "%1"=="push" (
  echo Logging into Docker Hub...
  docker login

  echo Building production images...
  copy /Y client\.env.prod client\.env >nul

  rem client\.env 파일 전체 읽어서 환경변수로 세팅
  for /f "usebackq tokens=1* delims==" %%a in (`findstr /r "^[^#]" client\.env`) do (
    echo Setting variable %%a=%%b
    set "%%a=%%b"
  )
  
  docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

  echo Pushing images to Docker Hub...
  docker compose -f docker-compose.yml -f docker-compose.prod.yml push

  echo Reverting env files back to local...
  copy /Y client\.env.local client\.env >nul
  copy /Y server\.env.local server\.env >nul
  goto end
)


echo Invalid argument: %1
echo Usage: run.bat [start^|stop^|push]

:end
