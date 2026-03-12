@echo off
node gen_blog.js
node gen_about.js
git add .
set /p msg="Commit message (Enter = update): "
if "%msg%"=="" set msg=update
git commit -m "%msg%"
git push
pause
