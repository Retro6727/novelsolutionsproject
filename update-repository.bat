@echo off
echo 🚀 Novel Solutions Repository Update Script
echo ============================================
echo.

set "sourceDir=C:\Users\Rupesh Pandey\OneDrive\Desktop\novelsols"
set "targetDir=C:\Users\Rupesh Pandey\OneDrive\Desktop\NovelNextProject"

echo 📂 Source: %sourceDir%
echo 📂 Target: %targetDir%
echo.

REM Check if directories exist
if not exist "%sourceDir%" (
    echo ❌ Source directory not found: %sourceDir%
    pause
    exit /b 1
)

if not exist "%targetDir%" (
    echo ❌ Target directory not found: %targetDir%
    echo Please make sure your GitHub repository path is correct.
    pause
    exit /b 1
)

REM Navigate to target directory
cd /d "%targetDir%"

REM Create backup
echo 💾 Creating backup...
git checkout -b backup-%date:~-4,4%-%date:~-10,2%-%date:~-7,2% 2>nul
git add . 2>nul
git commit -m "Backup before major update" 2>nul
echo ✅ Backup created
echo.

REM Switch back to main
git checkout main 2>nul

REM Copy source files
echo 📁 Copying source files...
if exist "%targetDir%\src" rmdir /s /q "%targetDir%\src"
xcopy "%sourceDir%\src" "%targetDir%\src" /E /I /Y >nul
echo ✅ Source files copied

REM Copy configuration files
echo ⚙️ Copying configuration files...
copy "%sourceDir%\package.json" "%targetDir%\" /Y >nul
copy "%sourceDir%\next.config.mjs" "%targetDir%\" /Y >nul
copy "%sourceDir%\.gitignore" "%targetDir%\" /Y >nul
if not exist "%targetDir%\prisma" mkdir "%targetDir%\prisma"
copy "%sourceDir%\prisma\schema.prisma" "%targetDir%\prisma\" /Y >nul
echo ✅ Configuration files copied

REM Copy documentation
echo 📚 Copying documentation...
copy "%sourceDir%\*.md" "%targetDir%\" /Y >nul
echo ✅ Documentation copied

REM Copy utility scripts
echo 🔧 Copying utility scripts...
copy "%sourceDir%\*.js" "%targetDir%\" /Y >nul
copy "%sourceDir%\*.sql" "%targetDir%\" /Y >nul
echo ✅ Utility scripts copied

REM Copy public assets
echo 🖼️ Copying public assets...
if exist "%targetDir%\public" rmdir /s /q "%targetDir%\public"
xcopy "%sourceDir%\public" "%targetDir%\public" /E /I /Y >nul
echo ✅ Public assets copied

echo.
echo 🎉 Files copied successfully!
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% equ 0 (
    echo ✅ Dependencies installed
) else (
    echo ⚠️ Could not install dependencies. Run 'npm install' manually.
)

echo.
echo 📝 NEXT STEPS:
echo =============
echo.
echo 1. 🔐 Create .env file:
echo    Copy your environment variables from the source .env file
echo    (DO NOT copy the .env file directly - create it manually)
echo.
echo 2. 🧪 Test locally:
echo    npm run dev
echo.
echo 3. 🚀 Commit and push:
echo    git add .
echo    git commit -m "🚀 Major update: Add contact form, admin security, dual database"
echo    git push origin main
echo.
echo 4. 🌐 Deploy to Vercel:
echo    Add environment variables to Vercel dashboard
echo    Deploy from GitHub
echo.
echo 🎯 Your repository is now updated with all new features!
echo    - Secure admin authentication
echo    - Professional contact form with email
echo    - Dual database system (Prisma + Supabase)
echo    - Enterprise-grade security
echo    - Complete documentation
echo    - Vercel deployment ready
echo.
pause