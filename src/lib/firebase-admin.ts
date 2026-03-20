// Firebase Admin Configuration (Server-side only)
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminAuth: Auth | undefined;

// Initialize Firebase Admin only once
if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      console.warn('⚠️ Firebase Admin credentials not configured. Firebase Auth will not work.');
      console.warn('Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env');
    } else {
      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      
      adminAuth = getAuth(adminApp);
      console.log('✅ Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
    console.warn('⚠️ Continuing without Firebase Admin. Please check your Firebase credentials.');
  }
} else {
  adminApp = getApps()[0];
  if (adminApp) {
    adminAuth = getAuth(adminApp);
  }
}

// Export with safe fallback
export { adminAuth };
export default adminApp;

