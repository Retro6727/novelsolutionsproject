# 🔧 GitHub Repository Troubleshooting Guide

## 🚨 **Common GitHub Problems & Solutions**

### **Problem 1: Push/Pull Errors**

#### **Error: "failed to push some refs"**
```bash
# Solution 1: Pull first, then push
git pull origin main --rebase
git push origin main

# Solution 2: Force push (careful!)
git push origin main --force-with-lease
```

#### **Error: "Your branch and 'origin/main' have diverged"**
```bash
# Solution: Reset and sync
git fetch origin
git reset --hard origin/main
git push origin main
```

### **Problem 2: Merge Conflicts**

#### **Files showing conflict markers (<<<<<<< >>>>>>> =======)**
```bash
# Solution: Reset and clean merge
git merge --abort
git reset --hard HEAD
git pull origin main
```

#### **package.json or package-lock.json conflicts**
```bash
# Solution: Regenerate lock file
git reset --hard HEAD
del package-lock.json
npm install
git add .
git commit -m "Fix package conflicts"
git push origin main
```

### **Problem 3: Missing Files on GitHub**

#### **Files not appearing in repository**
```bash
# Check what's staged
git status

# Add missing files
git add .
git commit -m "Add missing files"
git push origin main
```

#### **Documentation files missing**
```bash
# Copy documentation from source
copy "C:\Users\Rupesh Pandey\OneDrive\Desktop\novelsols\*.md" .
git add *.md
git commit -m "Add documentation"
git push origin main
```

### **Problem 4: Environment Variables Issues**

#### **Accidentally committed .env files**
```bash
# URGENT: Remove .env files
git rm --cached .env
echo ".env*" >> .gitignore
git add .gitignore
git commit -m "Remove .env files and protect secrets"
git push origin main

# Change all passwords/API keys immediately!
```

### **Problem 5: Large Files or Repository Size**

#### **Repository too large**
```bash
# Remove large files
git rm --cached large-file.zip
echo "*.zip" >> .gitignore
git commit -m "Remove large files"
git push origin main
```

#### **node_modules in repository**
```bash
# Remove node_modules
git rm -r --cached node_modules
echo "node_modules/" >> .gitignore
git commit -m "Remove node_modules"
git push origin main
```

### **Problem 6: Deployment Issues**

#### **Vercel deployment failing**
```bash
# Check these files exist:
# - package.json ✓
# - next.config.mjs ✓
# - src/ folder ✓

# Ensure build script is correct
# In package.json:
"scripts": {
  "build": "prisma generate && next build",
  "start": "next start"
}
```

#### **Environment variables not working**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add all variables from your .env file
4. Redeploy

### **Problem 7: Branch Issues**

#### **Wrong branch (master vs main)**
```bash
# Check current branch
git branch

# If on master, switch to main
git checkout -b main
git push origin main

# Set main as default in GitHub settings
```

### **Problem 8: Authentication Issues**

#### **Permission denied or authentication failed**
```bash
# Re-authenticate with GitHub
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Use personal access token instead of password
```

## 🆘 **Emergency Reset (Nuclear Option)**

If everything is broken and you need to start fresh:

```bash
# Navigate to your repository
cd "C:\Users\Rupesh Pandey\OneDrive\Desktop\NovelNextProject"

# Backup your current work
git stash push -m "Emergency backup"

# Reset to remote state
git fetch origin
git reset --hard origin/main

# If you need your changes back
git stash pop

# Or copy files from your working directory
xcopy "C:\Users\Rupesh Pandey\OneDrive\Desktop\novelsols\src" "src" /E /Y
xcopy "C:\Users\Rupesh Pandey\OneDrive\Desktop\novelsols\*.md" . /Y

# Commit everything
git add .
git commit -m "Emergency repository restoration"
git push origin main
```

## 🔍 **Diagnostic Commands**

Run these to identify issues:

```bash
# Check repository status
git status
git log --oneline -5
git remote -v

# Check for conflicts
git diff
git diff --cached

# Check branch information
git branch -a
git show-branch

# Check file sizes
git ls-files | xargs ls -la
```

## 📞 **Get Specific Help**

Tell me about your specific problem:

1. **What error message are you seeing?**
2. **What were you trying to do when it failed?**
3. **Are you having issues with:**
   - Pushing code?
   - Deploying to Vercel?
   - Missing files?
   - Merge conflicts?
   - Authentication?
   - Website functionality?

## 🎯 **Quick Fixes for Common Issues**

### **"Everything is broken"**
```bash
.\fix-package-conflicts.bat
```

### **"Files are missing"**
```bash
.\update-repository.bat
```

### **"Can't push to GitHub"**
```bash
git push origin main --force-with-lease
```

### **"Website won't deploy"**
Check:
1. Environment variables in Vercel
2. Build script in package.json
3. No .env files in repository

**Describe your specific problem and I'll provide targeted assistance!** 🎯