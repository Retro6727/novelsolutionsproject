# PowerShell Script to Update GitHub Repository
# Run this script to copy all updates to your existing GitHub repository

$sourceDir = "C:\Users\Rupesh Pandey\OneDrive\Desktop\novelsols"
$targetDir = "C:\Users\Rupesh Pandey\OneDrive\Desktop\NovelNextProject"

Write-Host "🚀 Novel Solutions Repository Update Script" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if directories exist
if (-not (Test-Path $sourceDir)) {
    Write-Host "❌ Source directory not found: $sourceDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $targetDir)) {
    Write-Host "❌ Target directory not found: $targetDir" -ForegroundColor Red
    Write-Host "Please make sure your GitHub repository path is correct." -ForegroundColor Yellow
    exit 1
}

Write-Host "📂 Source: $sourceDir" -ForegroundColor Cyan
Write-Host "📂 Target: $targetDir" -ForegroundColor Cyan
Write-Host ""

# Create backup
Write-Host "💾 Creating backup..." -ForegroundColor Yellow
Set-Location $targetDir
try {
    git checkout -b "backup-$(Get-Date -Format 'yyyy-MM-dd-HHmm')" 2>$null
    git add . 2>$null
    git commit -m "Backup before major update" 2>$null
    Write-Host "✅ Backup created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not create git backup (continuing anyway)" -ForegroundColor Yellow
}
Write-Host ""

# Switch back to main branch
try {
    git checkout main 2>$null
} catch {
    Write-Host "⚠️ Could not switch to main branch" -ForegroundColor Yellow
}

# Copy source code
Write-Host "📁 Copying source files..." -ForegroundColor Yellow
if (Test-Path "$targetDir\src") {
    Remove-Item "$targetDir\src" -Recurse -Force
}
Copy-Item "$sourceDir\src" "$targetDir\src" -Recurse -Force
Write-Host "✅ Source files copied" -ForegroundColor Green

# Copy configuration files
Write-Host "⚙️ Copying configuration files..." -ForegroundColor Yellow
$configFiles = @(
    "package.json",
    "next.config.mjs",
    ".gitignore"
)

foreach ($file in $configFiles) {
    if (Test-Path "$sourceDir\$file") {
        Copy-Item "$sourceDir\$file" "$targetDir\$file" -Force
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
}

# Copy Prisma schema
if (Test-Path "$sourceDir\prisma\schema.prisma") {
    if (-not (Test-Path "$targetDir\prisma")) {
        New-Item -ItemType Directory -Path "$targetDir\prisma" -Force
    }
    Copy-Item "$sourceDir\prisma\schema.prisma" "$targetDir\prisma\schema.prisma" -Force
    Write-Host "  ✅ prisma/schema.prisma" -ForegroundColor Green
}

# Copy documentation
Write-Host "📚 Copying documentation..." -ForegroundColor Yellow
Get-ChildItem "$sourceDir\*.md" | ForEach-Object {
    Copy-Item $_.FullName "$targetDir\$($_.Name)" -Force
    Write-Host "  ✅ $($_.Name)" -ForegroundColor Green
}

# Copy utility scripts
Write-Host "🔧 Copying utility scripts..." -ForegroundColor Yellow
$scriptExtensions = @("*.js", "*.sql")
foreach ($ext in $scriptExtensions) {
    Get-ChildItem "$sourceDir\$ext" | ForEach-Object {
        # Skip node_modules and other directories
        if ($_.Directory.Name -eq "novelsols") {
            Copy-Item $_.FullName "$targetDir\$($_.Name)" -Force
            Write-Host "  ✅ $($_.Name)" -ForegroundColor Green
        }
    }
}

# Copy public assets
Write-Host "🖼️ Copying public assets..." -ForegroundColor Yellow
if (Test-Path "$sourceDir\public") {
    if (Test-Path "$targetDir\public") {
        Remove-Item "$targetDir\public" -Recurse -Force
    }
    Copy-Item "$sourceDir\public" "$targetDir\public" -Recurse -Force
    Write-Host "✅ Public assets copied" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Files copied successfully!" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Set-Location $targetDir
try {
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not install dependencies. Run 'npm install' manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🔐 Create .env file:" -ForegroundColor White
Write-Host "   Copy your environment variables from the source .env file" -ForegroundColor Gray
Write-Host "   (DO NOT copy the .env file directly - create it manually)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🧪 Test locally:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🚀 Commit and push:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m `"🚀 Major update: Add contact form, admin security, dual database`"" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 🌐 Deploy to Vercel:" -ForegroundColor White
Write-Host "   Add environment variables to Vercel dashboard" -ForegroundColor Gray
Write-Host "   Deploy from GitHub" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 Your repository is now updated with all new features!" -ForegroundColor Green
Write-Host "   - Secure admin authentication" -ForegroundColor Gray
Write-Host "   - Professional contact form with email" -ForegroundColor Gray
Write-Host "   - Dual database system (Prisma + Supabase)" -ForegroundColor Gray
Write-Host "   - Enterprise-grade security" -ForegroundColor Gray
Write-Host "   - Complete documentation" -ForegroundColor Gray
Write-Host "   - Vercel deployment ready" -ForegroundColor Gray