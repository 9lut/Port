// Firestore Admin Helper (Server-side only)
import { getFirestore, Timestamp, Firestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin app if not already done
if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    } else {
      console.warn('⚠️ Firebase Admin credentials not configured.');
    }
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin app:', err);
  }
}

// Initialize Firestore with error handling
let adminDb: Firestore | undefined;

try {
  const apps = getApps();
  if (apps.length > 0) {
    adminDb = getFirestore(apps[0]);
    console.log('✅ Firestore Admin initialized successfully');
  } else {
    console.warn('⚠️ Firebase Admin not initialized. Firestore will not work.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firestore Admin:', error);
}

// Helper function to convert Firestore timestamp to ISO string
export function timestampToString(timestamp: Timestamp | Date | string | null | undefined): string {
  if (!timestamp) return '';
  
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  return '';
}

// Helper function to convert ISO string to Firestore timestamp
export function stringToTimestamp(dateString: string): Date {
  return new Date(dateString);
}

export { adminDb };
export default adminDb;

