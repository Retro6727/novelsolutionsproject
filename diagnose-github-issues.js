// GitHub Issues Diagnostic Script
// Identifies and suggests fixes for common GitHub problems

import https from 'https';

const REPO_URL = 'https://github.com/Retro6727/NovelNextProject';
const API_URL = 'https://api.github.com/repos/Retro6727/NovelNextProject';

console.log('🔍 Diagnosing GitHub Repository Issues');
console.log('=====================================');
console.log(`📂 Repository: ${REPO_URL}`);
console.log('');

async function diagnoseIssues() {
  const issues = [];
  const warnings = [];
  const suggestions = [];

  try {
    // Check repository accessibility
    console.log('1️⃣ Checking repository accessibility...');
    
    const repoData = await fetchJSON(API_URL);
    console.log('✅ Repository is accessible');
    
    // Check for common issues
    console.log('\n2️⃣ Checking for common issues...');
    
    // Issue 1: Branch mismatch
    if (repoData.default_branch !== 'main' && repoData.default_branch !== 'master') {
      issues.push(`Unusual default branch: ${repoData.default_branch}`);
    }
    
    // Issue 2: No recent commits
    const commits = await fetchJSON(`${API_URL}/commits?per_page=1`);
    const lastCommit = new Date(commits[0].commit.author.date);
    const daysSinceLastCommit = (Date.now() - lastCommit.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastCommit > 7) {
      warnings.push(`Last commit was ${Math.floor(daysSinceLastCommit)} days ago`);
    }
    
    // Issue 3: Check for build files in repository
    const contents = await fetchJSON(`${API_URL}/contents`);
    const fileNames = contents.map(item => item.name);
    
    const buildFiles = ['node_modules', '.next', 'dist', 'build'];
    const foundBuildFiles = buildFiles.filter(file => fileNames.includes(file));
    
    if (foundBuildFiles.length > 0) {
      issues.push(`Build files in repository: ${foundBuildFiles.join(', ')}`);
      suggestions.push('Add these to .gitignore and remove from repository');
    }
    
    // Issue 4: Missing important files
    const importantFiles = ['package.json', '.gitignore', 'README.md'];
    const missingFiles = importantFiles.filter(file => !fileNames.includes(file));
    
    if (missingFiles.length > 0) {
      issues.push(`Missing important files: ${missingFiles.join(', ')}`);
    }
    
    // Issue 5: Check for environment files
    const envFiles = ['.env', '.env.local', '.env.production'];
    const foundEnvFiles = envFiles.filter(file => fileNames.includes(file));
    
    if (foundEnvFiles.length > 0) {
      issues.push(`🚨 SECURITY RISK: Environment files in repository: ${foundEnvFiles.join(', ')}`);
      suggestions.push('IMMEDIATELY remove .env files and add to .gitignore');
    }
    
    // Issue 6: Check repository size
    if (repoData.size > 100000) { // 100MB
      warnings.push(`Large repository size: ${(repoData.size / 1024).toFixed(2)} MB`);
      suggestions.push('Consider using Git LFS for large files');
    }
    
    // Issue 7: Check for package-lock.json issues
    try {
      const packageLock = await fetchJSON(`${API_URL}/contents/package-lock.json`);
      if (packageLock.size > 1000000) { // 1MB
        warnings.push('Large package-lock.json file detected');
        suggestions.push('Consider cleaning up dependencies');
      }
    } catch (error) {
      warnings.push('No package-lock.json found');
    }
    
    // Issue 8: Check for merge conflicts in files
    for (const file of ['package.json', 'package-lock.json', 'README.md']) {
      try {
        const fileContent = await fetchJSON(`${API_URL}/contents/${file}`);
        const content = Buffer.from(fileContent.content, 'base64').toString();
        
        if (content.includes('<<<<<<<') || content.includes('>>>>>>>') || content.includes('=======')) {
          issues.push(`🚨 MERGE CONFLICT in ${file}`);
          suggestions.push(`Fix merge conflicts in ${file}`);
        }
      } catch (error) {
        // File doesn't exist, skip
      }
    }
    
    // Issue 9: Check workflow files
    try {
      const workflows = await fetchJSON(`${API_URL}/contents/.github/workflows`);
      if (workflows.length === 0) {
        warnings.push('No GitHub Actions workflows found');
        suggestions.push('Consider adding CI/CD workflows');
      }
    } catch (error) {
      // No workflows directory
    }
    
    // Issue 10: Check for Vercel deployment issues
    const vercelFiles = ['vercel.json', '.vercelignore'];
    const hasVercelConfig = vercelFiles.some(file => fileNames.includes(file));
    
    if (!hasVercelConfig && fileNames.includes('next.config.mjs')) {
      suggestions.push('Consider adding vercel.json for deployment optimization');
    }
    
  } catch (error) {
    issues.push(`Repository access error: ${error.message}`);
    
    if (error.message.includes('404')) {
      suggestions.push('Repository might be private or URL might be incorrect');
    }
    if (error.message.includes('403')) {
      suggestions.push('Authentication required or rate limit exceeded');
    }
  }
  
  // Display results
  console.log('\n📊 DIAGNOSTIC RESULTS');
  console.log('=====================');
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('🎉 NO ISSUES FOUND!');
    console.log('✅ Repository appears to be healthy');
  } else {
    if (issues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }
    
    if (suggestions.length > 0) {
      console.log('\n💡 SUGGESTED FIXES:');
      suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
      });
    }
  }
  
  // Common solutions
  console.log('\n🔧 COMMON SOLUTIONS:');
  console.log('====================');
  console.log('');
  console.log('🔄 If you have merge conflicts:');
  console.log('   git reset --hard HEAD');
  console.log('   git pull origin main');
  console.log('');
  console.log('🗑️ If you have unwanted files:');
  console.log('   git rm --cached filename');
  console.log('   echo "filename" >> .gitignore');
  console.log('   git commit -m "Remove unwanted file"');
  console.log('');
  console.log('🚨 If you have .env files in repo:');
  console.log('   git rm --cached .env');
  console.log('   echo ".env*" >> .gitignore');
  console.log('   git commit -m "Remove .env files"');
  console.log('   git push origin main');
  console.log('');
  console.log('🔄 If you need to force update:');
  console.log('   git push origin main --force-with-lease');
  console.log('');
  console.log('📞 Need help? Describe your specific issue for targeted assistance.');
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'GitHub-Diagnostic-Tool'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${jsonData.message || 'Request failed'}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Run the diagnostic
diagnoseIssues();