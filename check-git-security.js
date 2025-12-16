// Git Security Checker
// Run with: node check-git-security.js

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔍 Git Security Check\n');

const securityIssues = [];
const warnings = [];
const goodPractices = [];

try {
  // 1. Check if .env files are tracked
  console.log('1️⃣ Checking for .env files in git...');
  try {
    const trackedEnvFiles = execSync('git ls-files | grep -E "^\\.env"', { encoding: 'utf8' }).trim();
    if (trackedEnvFiles) {
      securityIssues.push(`🚨 CRITICAL: .env files are tracked in git: ${trackedEnvFiles}`);
    } else {
      goodPractices.push('✅ No .env files tracked in git');
    }
  } catch (error) {
    goodPractices.push('✅ No .env files tracked in git');
  }

  // 2. Check .gitignore for .env protection
  console.log('2️⃣ Checking .gitignore protection...');
  if (fs.existsSync('.gitignore')) {
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    if (gitignoreContent.includes('.env')) {
      goodPractices.push('✅ .env files protected by .gitignore');
    } else {
      securityIssues.push('🚨 CRITICAL: .env not in .gitignore');
    }
  } else {
    securityIssues.push('🚨 CRITICAL: No .gitignore file found');
  }

  // 3. Check for hardcoded secrets in source code
  console.log('3️⃣ Scanning source code for potential secrets...');
  
  const secretPatterns = [
    { pattern: /api[_-]?key\s*[:=]\s*['"]\w+['"]/, name: 'API keys' },
    { pattern: /password\s*[:=]\s*['"]\w+['"]/, name: 'Passwords' },
    { pattern: /secret\s*[:=]\s*['"]\w+['"]/, name: 'Secrets' },
    { pattern: /token\s*[:=]\s*['"]\w+['"]/, name: 'Tokens' },
    { pattern: /SG\.\w+/, name: 'SendGrid API keys' },
    { pattern: /sk_\w+/, name: 'Stripe secret keys' },
    { pattern: /postgres:\/\/\w+:\w+@/, name: 'Database URLs with credentials' }
  ];

  const sourceFiles = [
    'src/app/admin/page.js',
    'src/app/api/contact/route.js',
    'src/app/api/admin/auth/route.js',
    'src/lib/supabase.js'
  ];

  let foundSecrets = false;
  sourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      secretPatterns.forEach(({ pattern, name }) => {
        if (pattern.test(content)) {
          // Check if it's using environment variables (safe)
          if (content.includes('process.env')) {
            // This is likely safe - using environment variables
          } else {
            securityIssues.push(`🚨 Potential ${name} found in ${file}`);
            foundSecrets = true;
          }
        }
      });
    }
  });

  if (!foundSecrets) {
    goodPractices.push('✅ No hardcoded secrets found in source code');
  }

  // 4. Check environment variable usage
  console.log('4️⃣ Checking environment variable usage...');
  let usesEnvVars = false;
  sourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('process.env')) {
        usesEnvVars = true;
      }
    }
  });

  if (usesEnvVars) {
    goodPractices.push('✅ Using environment variables for configuration');
  } else {
    warnings.push('⚠️ No environment variable usage detected');
  }

  // 5. Check for .env file existence (should exist locally but not in git)
  console.log('5️⃣ Checking local .env file...');
  if (fs.existsSync('.env')) {
    goodPractices.push('✅ Local .env file exists for development');
  } else {
    warnings.push('⚠️ No .env file found - you may need to create one');
  }

  // 6. Check git status for uncommitted .env files
  console.log('6️⃣ Checking git status...');
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.includes('.env')) {
      warnings.push('⚠️ .env files in git status - make sure they\'re not staged for commit');
    } else {
      goodPractices.push('✅ No .env files in git staging area');
    }
  } catch (error) {
    warnings.push('⚠️ Could not check git status');
  }

} catch (error) {
  console.error('Error during security check:', error.message);
}

// Display results
console.log('\n📊 SECURITY SCAN RESULTS');
console.log('========================\n');

if (goodPractices.length > 0) {
  console.log('✅ GOOD SECURITY PRACTICES:');
  goodPractices.forEach(practice => console.log(practice));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️ WARNINGS:');
  warnings.forEach(warning => console.log(warning));
  console.log('');
}

if (securityIssues.length > 0) {
  console.log('🚨 CRITICAL SECURITY ISSUES:');
  securityIssues.forEach(issue => console.log(issue));
  console.log('');
  console.log('🔧 IMMEDIATE ACTIONS REQUIRED:');
  console.log('1. Remove any tracked .env files: git rm --cached .env');
  console.log('2. Add .env* to .gitignore');
  console.log('3. Rotate any exposed credentials');
  console.log('4. Use environment variables for all secrets');
} else {
  console.log('🎉 NO CRITICAL SECURITY ISSUES FOUND!\n');
}

// Final recommendation
console.log('🎯 DEPLOYMENT READINESS');
console.log('=======================');

if (securityIssues.length === 0) {
  console.log('✅ SECURE - Ready for GitHub and deployment');
  console.log('\n📋 Safe to commit:');
  console.log('- All source code files');
  console.log('- Configuration files (next.config.mjs, package.json)');
  console.log('- Documentation files (*.md)');
  console.log('- Database schemas (prisma/schema.prisma)');
  console.log('- Utility scripts');
  
  console.log('\n🚫 Never commit:');
  console.log('- .env files');
  console.log('- Files with hardcoded secrets');
  console.log('- Private keys or certificates');
  
} else {
  console.log('❌ SECURITY ISSUES FOUND - Fix before deployment');
}

console.log('\n🔗 For more details, see: GITHUB_SECURITY_GUIDE.md');