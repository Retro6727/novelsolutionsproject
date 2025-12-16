// Pre-Deployment Verification Script
// Run with: node pre-deployment-check.js

import fs from 'fs';
import path from 'path';

console.log('🚀 Pre-Deployment Verification for Vercel\n');

const checks = {
  files: [],
  env: [],
  config: [],
  dependencies: [],
  warnings: [],
  errors: []
};

// 1. Check required files
console.log('1️⃣ Checking Required Files...');
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'prisma/schema.prisma',
  'src/app/layout.js',
  'src/app/page.js',
  'src/app/api/contact/route.js',
  'src/app/api/admin/inquiries/route.js',
  'src/lib/supabase.js',
  '.gitignore'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.files.push(`✅ ${file}`);
  } else {
    checks.errors.push(`❌ Missing: ${file}`);
  }
});

// 2. Check environment variables
console.log('\n2️⃣ Checking Environment Variables...');
const requiredEnvVars = [
  'DATABASE_URL',
  'SENDGRID_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';

requiredEnvVars.forEach(envVar => {
  if (envContent.includes(envVar)) {
    const value = envContent.split('\n').find(line => line.startsWith(envVar))?.split('=')[1];
    if (value && !value.includes('your_') && !value.includes('placeholder')) {
      checks.env.push(`✅ ${envVar} configured`);
    } else {
      checks.warnings.push(`⚠️ ${envVar} needs real value`);
    }
  } else {
    checks.errors.push(`❌ Missing: ${envVar}`);
  }
});

// 3. Check package.json configuration
console.log('\n3️⃣ Checking Package Configuration...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check scripts
  if (packageJson.scripts?.build) {
    checks.config.push('✅ Build script configured');
  } else {
    checks.errors.push('❌ Missing build script');
  }
  
  if (packageJson.scripts?.postinstall) {
    checks.config.push('✅ Postinstall script configured');
  } else {
    checks.warnings.push('⚠️ Missing postinstall script');
  }
  
  // Check dependencies
  const requiredDeps = ['@prisma/client', '@supabase/supabase-js', 'next', 'react'];
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep]) {
      checks.dependencies.push(`✅ ${dep}`);
    } else {
      checks.errors.push(`❌ Missing dependency: ${dep}`);
    }
  });
  
} catch (error) {
  checks.errors.push('❌ Invalid package.json');
}

// 4. Check Next.js configuration
console.log('\n4️⃣ Checking Next.js Configuration...');
try {
  const nextConfigContent = fs.readFileSync('next.config.mjs', 'utf8');
  
  if (nextConfigContent.includes('serverComponentsExternalPackages')) {
    checks.config.push('✅ Prisma external packages configured');
  } else {
    checks.warnings.push('⚠️ Consider adding Prisma external packages config');
  }
  
  if (nextConfigContent.includes('supabase.co')) {
    checks.config.push('✅ Supabase images domain configured');
  } else {
    checks.warnings.push('⚠️ Supabase images domain not configured');
  }
  
} catch (error) {
  checks.warnings.push('⚠️ Could not read next.config.mjs');
}

// 5. Check Prisma schema
console.log('\n5️⃣ Checking Prisma Configuration...');
try {
  const prismaSchema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  
  if (prismaSchema.includes('binaryTargets')) {
    checks.config.push('✅ Prisma binary targets configured for Vercel');
  } else {
    checks.warnings.push('⚠️ Add binary targets for better Vercel compatibility');
  }
  
  if (prismaSchema.includes('ContactInquiry')) {
    checks.config.push('✅ ContactInquiry model exists');
  } else {
    checks.errors.push('❌ ContactInquiry model missing');
  }
  
} catch (error) {
  checks.errors.push('❌ Could not read Prisma schema');
}

// 6. Check .gitignore
console.log('\n6️⃣ Checking Git Configuration...');
try {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  
  if (gitignoreContent.includes('.env')) {
    checks.config.push('✅ .env files ignored');
  } else {
    checks.errors.push('❌ .env not in .gitignore - SECURITY RISK!');
  }
  
  if (gitignoreContent.includes('node_modules')) {
    checks.config.push('✅ node_modules ignored');
  } else {
    checks.warnings.push('⚠️ node_modules should be in .gitignore');
  }
  
} catch (error) {
  checks.warnings.push('⚠️ Could not read .gitignore');
}

// Display results
console.log('\n📊 VERIFICATION RESULTS');
console.log('======================');

console.log('\n✅ PASSED CHECKS:');
[...checks.files, ...checks.env, ...checks.config, ...checks.dependencies].forEach(check => {
  console.log(check);
});

if (checks.warnings.length > 0) {
  console.log('\n⚠️ WARNINGS:');
  checks.warnings.forEach(warning => {
    console.log(warning);
  });
}

if (checks.errors.length > 0) {
  console.log('\n❌ ERRORS (MUST FIX):');
  checks.errors.forEach(error => {
    console.log(error);
  });
}

// Final recommendation
console.log('\n🎯 DEPLOYMENT READINESS');
console.log('=======================');

if (checks.errors.length === 0) {
  console.log('✅ READY FOR DEPLOYMENT!');
  console.log('\n📋 Next Steps:');
  console.log('1. Commit and push your changes');
  console.log('2. Connect repository to Vercel');
  console.log('3. Add environment variables in Vercel dashboard');
  console.log('4. Deploy and test');
  
  if (checks.warnings.length > 0) {
    console.log('\n💡 Consider addressing warnings for optimal performance');
  }
} else {
  console.log('❌ NOT READY - Fix errors first');
  console.log('\n🔧 Required Actions:');
  checks.errors.forEach(error => {
    console.log(`   ${error}`);
  });
}

console.log('\n🔗 Helpful Links:');
console.log('- Vercel Dashboard: https://vercel.com/dashboard');
console.log('- Supabase Dashboard: https://uwuuyelynldcpumhcqhn.supabase.co');
console.log('- SendGrid Dashboard: https://app.sendgrid.com');
console.log('- Deployment Guide: See VERCEL_DEPLOYMENT_GUIDE.md');

export { checks };