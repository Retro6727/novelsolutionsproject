import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Secure password hashing function
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Generate a random salt
function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}

// Verify password against hash
function verifyPassword(password, hash, salt) {
  const hashToVerify = hashPassword(password, salt);
  return hashToVerify === hash;
}

export async function POST(req) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ 
        error: 'Password required' 
      }, { status: 400 });
    }

    // Get admin credentials from environment variables
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    const ADMIN_PASSWORD_SALT = process.env.ADMIN_PASSWORD_SALT;

    let isValidPassword = false;

    // Method 1: Check against hashed password (most secure)
    if (ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_SALT) {
      isValidPassword = verifyPassword(password, ADMIN_PASSWORD_HASH, ADMIN_PASSWORD_SALT);
      console.log('🔐 Using hashed password authentication');
    }
    // Method 2: Fallback to plain text password (less secure, for development)
    else if (ADMIN_PASSWORD) {
      isValidPassword = password === ADMIN_PASSWORD;
      console.log('⚠️ Using plain text password - consider upgrading to hashed password');
    }
    // Method 3: Default password (development only)
    else {
      const defaultPassword = 'novelsolutions@012';
      isValidPassword = password === defaultPassword;
      console.log('🚨 Using default password - CHANGE IMMEDIATELY for production!');
    }

    if (isValidPassword) {
      // Generate a session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // In a real app, you'd store this in a database or Redis
      // For now, we'll use a simple in-memory store (resets on server restart)
      global.adminSessions = global.adminSessions || new Map();
      global.adminSessions.set(sessionToken, {
        createdAt: new Date(),
        expiresAt,
        lastActivity: new Date()
      });

      // Clean up expired sessions
      for (const [token, session] of global.adminSessions.entries()) {
        if (session.expiresAt < new Date()) {
          global.adminSessions.delete(token);
        }
      }

      console.log('✅ Admin login successful');

      return NextResponse.json({
        ok: true,
        message: 'Authentication successful',
        sessionToken,
        expiresAt: expiresAt.toISOString()
      });
    } else {
      console.log('❌ Admin login failed - invalid password');
      
      return NextResponse.json({ 
        error: 'Invalid password' 
      }, { status: 401 });
    }

  } catch (error) {
    console.error('❌ Admin auth error:', error);
    return NextResponse.json({ 
      error: 'Authentication error' 
    }, { status: 500 });
  }
}

// Utility function to generate password hash (for setup)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const generateHash = searchParams.get('generate');
  
  if (generateHash === 'true') {
    const password = searchParams.get('password') || 'novelsolutions@012';
    const salt = generateSalt();
    const hash = hashPassword(password, salt);
    
    return NextResponse.json({
      password,
      salt,
      hash,
      envVars: {
        ADMIN_PASSWORD_HASH: hash,
        ADMIN_PASSWORD_SALT: salt
      },
      instructions: 'Add ADMIN_PASSWORD_HASH and ADMIN_PASSWORD_SALT to your environment variables'
    });
  }
  
  return NextResponse.json({ 
    error: 'Use POST for authentication' 
  }, { status: 405 });
}