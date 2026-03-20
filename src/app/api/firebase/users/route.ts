// API Route for creating Firebase users (Admin only)
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not configured' },
        { status: 503 }
      );
    }

    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create user in Firebase
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: displayName || email,
      emailVerified: true, // Auto-verify for admin created users
    });

    console.log('✅ Firebase user created:', userRecord.uid);

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error: unknown) {
    console.error('❌ User creation error:', error);
    const err = error as { code?: string; message?: string };
    
    if (err.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: err.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Get all users
export async function GET() {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not configured' },
        { status: 503 }
      );
    }

    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // List users (max 1000)
    const listUsersResult = await adminAuth.listUsers(1000);
    
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    }));

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('❌ List users error:', error);
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not configured' },
        { status: 503 }
      );
    }

    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await adminAuth.deleteUser(uid);

    console.log('✅ Firebase user deleted:', uid);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('❌ User deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
