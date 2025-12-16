@echo off
echo 🔧 Fixing package-lock.json Merge Conflict
echo ==========================================
echo.

set "targetDir=C:\Users\Rupesh Pandey\OneDrive\Desktop\NovelNextProject"

echo 📂 Navigating to repository: %targetDir%
cd /d "%targetDir%"

echo.
echo 🗑️ Removing conflicted package-lock.json...
if exist "package-lock.json" (
    del "package-lock.json"
    echo ✅ Removed old package-lock.json
) else (
    echo ℹ️ No package-lock.json found
)

echo.
echo 🧹 Cleaning npm cache...
npm cache clean --force

echo.
echo 📦 Regenerating package-lock.json...
npm install

echo.
echo 📋 Checking git status...
git status

echo.
echo 🔄 Adding regenerated files...
git add package-lock.json
git add package.json

echo.
echo 💾 Committing the fix...
git commit -m "🔧 Fix package-lock.json merge conflict - regenerate lockfile"

echo.
echo ✅ Package-lock conflict resolved!
echo.
echo 📝 Next steps:
echo 1. Run: git push origin main
echo 2. Continue with your normal workflow
echo.
pause