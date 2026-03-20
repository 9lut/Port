import CredentialsProvider from 'next-auth/providers/credentials';
import { adminAuth } from './firebase-admin';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          console.log('🔐 Attempting Firebase authentication for:', credentials.email);

          // Check if Firebase Admin is initialized
          if (!adminAuth) {
            console.error('❌ Firebase Admin not initialized. Please check your Firebase credentials.');
            return null;
          }

          // Note: Firebase Admin SDK doesn't have signInWithEmailAndPassword
          // We need to use Firebase Client SDK for actual authentication
          // and verify the token with Admin SDK
          // For now, we'll use a custom verification approach

          // This is a simplified version - in production, you should:
          // 1. Use Firebase Client SDK in the login page to get ID token
          // 2. Pass the ID token to this authorize function
          // 3. Verify the token with Firebase Admin SDK

          // For development, we'll verify the user exists in Firebase Auth
          try {
            const userRecord = await adminAuth.getUserByEmail(credentials.email);

            // Return user object that will be stored in JWT
            return {
              id: userRecord.uid,
              email: userRecord.email || '',
              name: userRecord.displayName || userRecord.email || '',
            };
          } catch (error: unknown) {
            const err = error as { code?: string };
            if (err.code === 'auth/user-not-found') {
              console.error('❌ User not found in Firebase');
            } else {
              console.error('❌ Firebase auth error:', error);
            }
            return null;
          }
        } catch (error) {
          console.error('❌ Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  // Enhanced security settings
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
        maxAge: 24 * 60 * 60, // 24 hours
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  // Additional security features
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
};
