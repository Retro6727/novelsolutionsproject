// Admin Password Generator
// Run with: node generate-admin-password.js

import crypto from 'crypto';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}

function generateSecurePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

console.log('🔐 Admin Password Security Setup\n');

rl.question('Choose an option:\n1. Generate a secure password\n2. Use your own password\n3. Hash existing password\n\nEnter choice (1-3): ', (choice) => {
  
  if (choice === '1') {
    // Generate secure password
    const password = generateSecurePassword();
    const salt = generateSalt();
    const hash = hashPassword(password, salt);
    
    console.log('\n✅ Secure Password Generated!\n');
    console.log('🔑 Generated Password:', password);
    console.log('📝 SAVE THIS PASSWORD - you won\'t see it again!\n');
    
    console.log('🔧 Add these to your .env file:');
    console.log('ADMIN_PASSWORD_HASH=' + hash);
    console.log('ADMIN_PASSWORD_SALT=' + salt);
    console.log('\n🚨 Remove any existing ADMIN_PASSWORD line from .env\n');
    
    rl.close();
    
  } else if (choice === '2') {
    rl.question('Enter your desired password: ', (password) => {
      if (password.length < 8) {
        console.log('❌ Password must be at least 8 characters long');
        rl.close();
        return;
      }
      
      const salt = generateSalt();
      const hash = hashPassword(password, salt);
      
      console.log('\n✅ Password Hashed Successfully!\n');
      console.log('🔧 Add these to your .env file:');
      console.log('ADMIN_PASSWORD_HASH=' + hash);
      console.log('ADMIN_PASSWORD_SALT=' + salt);
      console.log('\n🚨 Remove any existing ADMIN_PASSWORD line from .env\n');
      
      rl.close();
    });
    
  } else if (choice === '3') {
    rl.question('Enter existing password to hash: ', (password) => {
      const salt = generateSalt();
      const hash = hashPassword(password, salt);
      
      console.log('\n✅ Password Hashed Successfully!\n');
      console.log('🔧 Add these to your .env file:');
      console.log('ADMIN_PASSWORD_HASH=' + hash);
      console.log('ADMIN_PASSWORD_SALT=' + salt);
      console.log('\n🚨 Remove any existing ADMIN_PASSWORD line from .env\n');
      
      rl.close();
    });
    
  } else {
    console.log('❌ Invalid choice');
    rl.close();
  }
});

console.log('\n💡 Security Tips:');
console.log('- Use hashed passwords (ADMIN_PASSWORD_HASH) for production');
console.log('- Plain text passwords (ADMIN_PASSWORD) are for development only');
console.log('- Never commit passwords to git');
console.log('- Use strong passwords with mixed characters');
console.log('- Change default passwords immediately');