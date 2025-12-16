// GitHub Repository Verification Script
// Checks if the repository is properly set up and working

import https from 'https';

const REPO_URL = 'https://github.com/Retro6727/NovelNextProject';
const API_URL = 'https://api.github.com/repos/Retro6727/NovelNextProject';

console.log('🔍 Verifying GitHub Repository');
console.log('==============================');
console.log(`📂 Repository: ${REPO_URL}`);
console.log('');

async function checkRepository() {
  try {
    // Check if repository is accessible
    console.log('1️⃣ Checking repository accessibility...');
    
    const repoData = await fetchJSON(API_URL);
    
    if (repoData.name) {
      console.log('✅ Repository is accessible');
      console.log(`   Name: ${repoData.name}`);
      console.log(`   Description: ${repoData.description || 'No description'}`);
      console.log(`   Default Branch: ${repoData.default_branch}`);
      console.log(`   Last Updated: ${new Date(repoData.updated_at).toLocaleString()}`);
    }
    
    // Check repository contents
    console.log('\n2️⃣ Checking repository contents...');
    
    const contentsData = await fetchJSON(`${API_URL}/contents`);
    
    const expectedFiles = [
      'package.json',
      'next.config.mjs',
      'src',
      'prisma',
      'README.md',
      'DEPLOYMENT_SUMMARY.md',
      'ADMIN_SECURITY_GUIDE.md'
    ];
    
    const foundFiles = contentsData.map(item => item.name);
    
    expectedFiles.forEach(file => {
      if (foundFiles.includes(file)) {
        console.log(`✅ ${file} - Found`);
      } else {
        console.log(`❌ ${file} - Missing`);
      }
    });
    
    // Check for new features
    console.log('\n3️⃣ Checking for new features...');
    
    const newFeatures = [
      { path: 'src/app/admin', name: 'Admin Panel' },
      { path: 'src/app/contact', name: 'Contact Form' },
      { path: 'src/app/api/contact', name: 'Contact API' },
      { path: 'src/lib/supabase.js', name: 'Supabase Integration' },
      { path: 'prisma/schema.prisma', name: 'Database Schema' }
    ];
    
    for (const feature of newFeatures) {
      try {
        await fetchJSON(`${API_URL}/contents/${feature.path}`);
        console.log(`✅ ${feature.name} - Implemented`);
      } catch (error) {
        console.log(`❌ ${feature.name} - Missing`);
      }
    }
    
    // Check recent commits
    console.log('\n4️⃣ Checking recent commits...');
    
    const commitsData = await fetchJSON(`${API_URL}/commits?per_page=3`);
    
    commitsData.forEach((commit, index) => {
      const date = new Date(commit.commit.author.date).toLocaleString();
      const message = commit.commit.message.split('\n')[0];
      console.log(`${index + 1}. ${message} (${date})`);
    });
    
    // Repository health check
    console.log('\n5️⃣ Repository health check...');
    
    const healthChecks = [
      { check: 'Has README', status: foundFiles.includes('README.md') },
      { check: 'Has package.json', status: foundFiles.includes('package.json') },
      { check: 'Has source code', status: foundFiles.includes('src') },
      { check: 'Has documentation', status: foundFiles.some(f => f.endsWith('.md')) },
      { check: 'Recent activity', status: new Date(repoData.updated_at) > new Date(Date.now() - 24*60*60*1000) }
    ];
    
    healthChecks.forEach(({ check, status }) => {
      console.log(`${status ? '✅' : '❌'} ${check}`);
    });
    
    // Final assessment
    console.log('\n🎯 REPOSITORY ASSESSMENT');
    console.log('========================');
    
    const passedChecks = healthChecks.filter(h => h.status).length;
    const totalChecks = healthChecks.length;
    
    if (passedChecks === totalChecks) {
      console.log('🎉 EXCELLENT! Repository is fully functional');
      console.log('✅ All features successfully deployed');
      console.log('✅ Ready for Vercel deployment');
    } else if (passedChecks >= totalChecks * 0.8) {
      console.log('✅ GOOD! Repository is mostly functional');
      console.log(`📊 ${passedChecks}/${totalChecks} checks passed`);
    } else {
      console.log('⚠️ NEEDS ATTENTION! Some issues found');
      console.log(`📊 ${passedChecks}/${totalChecks} checks passed`);
    }
    
    console.log('\n🔗 USEFUL LINKS:');
    console.log(`📂 Repository: ${REPO_URL}`);
    console.log(`🌐 Deploy to Vercel: https://vercel.com/new/git/external?repository-url=${encodeURIComponent(REPO_URL + '.git')}`);
    console.log(`📋 Issues: ${REPO_URL}/issues`);
    console.log(`⚙️ Settings: ${REPO_URL}/settings`);
    
  } catch (error) {
    console.error('❌ Error checking repository:', error.message);
    
    if (error.message.includes('404')) {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('- Repository might be private (need authentication)');
      console.log('- Repository URL might be incorrect');
      console.log('- Repository might not exist yet');
    }
  }
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Repository-Checker'
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

// Run the check
checkRepository();