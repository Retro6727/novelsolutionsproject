@echo off
echo 🔄 Restoring Updates After Merge Conflict Resolution
echo ====================================================
echo.

set "sourceDir=C:\Users\Rupesh Pandey\OneDrive\Desktop\novelsols"
set "targetDir=C:\Users\Rupesh Pandey\OneDrive\Desktop\NovelNextProject"

echo 📂 Source: %sourceDir%
echo 📂 Target: %targetDir%
echo.

echo 🔄 Copying all updated files back to repository...
cd /d "%targetDir%"

echo.
echo 📁 Copying source code...
if exist "src" rmdir /s /q "src"
xcopy "%sourceDir%\src" "src" /E /I /Y >nul
echo ✅ Source code restored

echo.
echo ⚙️ Copying configuration files...
copy "%sourceDir%\package.json" . /Y >nul
copy "%sourceDir%\next.config.mjs" . /Y >nul
copy "%sourceDir%\.gitignore" . /Y >nul
if not exist "prisma" mkdir "prisma"
copy "%sourceDir%\prisma\schema.prisma" "prisma\" /Y >nul
copy "%sourceDir%\prisma.config.ts" . /Y >nul
echo ✅ Configuration files restored

echo.
echo 📚 Copying documentation...
copy "%sourceDir%\*.md" . /Y >nul
echo ✅ Documentation restored

echo.
echo 🔧 Copying utility scripts...
copy "%sourceDir%\*.js" . /Y >nul
copy "%sourceDir%\*.sql" . /Y >nul
echo ✅ Utility scripts restored

echo.
echo 🖼️ Copying public assets...
if exist "public" rmdir /s /q "public"
xcopy "%sourceDir%\public" "public" /E /I /Y >nul
echo ✅ Public assets restored

echo.
echo 📦 Installing dependencies...
del package-lock.json 2>nul
npm install
echo ✅ Dependencies installed

echo.
echo ➕ Adding all files to git...
git add .

echo.
echo 💾 Committing restored updates...
git commit -m "🚀 Restore all updates after merge conflict resolution

✅ Restored secure admin authentication system
✅ Restored professional contact form with email
✅ Restored dual database system (Prisma + Supabase)
✅ Restored enhanced product pages with reviews
✅ Restored mobile-responsive improvements
✅ Restored enterprise-grade security practices
✅ Restored complete documentation
✅ Restored Vercel deployment optimization

All merge conflicts resolved and features restored."

echo.
echo 🚀 Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCESS! All updates restored and pushed to GitHub!
    echo ========================================================
    echo.
    echo ✅ Merge conflicts resolved
    echo ✅ All new features restored
    echo ✅ Repository updated on GitHub
    echo ✅ Ready for Vercel deployment
    echo.
    echo 🔗 Your repository: https://github.com/Retro6727/NovelNextProject
    echo 🌐 Deploy to Vercel: https://vercel.com/new
    echo.
) else (
    echo.
    echo ⚠️ Push failed. You may need to force push:
    echo git push origin main --force-with-lease
    echo.
)

pause