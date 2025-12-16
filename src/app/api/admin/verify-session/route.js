import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { sessionToken } = await req.json();

    if (!sessionToken) {
      return NextResponse.json({ 
        valid: false, 
        error: 'No session token provided' 
      }, { status: 401 });
    }

    // Check if session exists and is valid
    global.adminSessions = global.adminSessions || new Map();
    const session = global.adminSessions.get(sessionToken);

    if (!session) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid session token' 
      }, { status: 401 });
    }

    // Check if session has expired
    if (session.expiresAt < new Date()) {
      global.adminSessions.delete(sessionToken);
      return NextResponse.json({ 
        valid: false, 
        error: 'Session expired' 
      }, { status: 401 });
    }

    // Update last activity
    session.lastActivity = new Date();
    global.adminSessions.set(sessionToken, session);

    return NextResponse.json({
      valid: true,
      expiresAt: session.expiresAt.toISOString(),
      lastActivity: session.lastActivity.toISOString()
    });

  } catch (error) {
    console.error('❌ Session verification error:', error);
    return NextResponse.json({ 
      valid: false, 
      error: 'Session verification failed' 
    }, { status: 500 });
  }
}

// Logout endpoint
export async function DELETE(req) {
  try {
    const { sessionToken } = await req.json();

    if (sessionToken) {
      global.adminSessions = global.adminSessions || new Map();
      global.adminSessions.delete(sessionToken);
      console.log('✅ Admin session terminated');
    }

    return NextResponse.json({
      ok: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.json({ 
      error: 'Logout failed' 
    }, { status: 500 });
  }
}