// Firebase Storage Admin Helper (Server-side only)
import { getStorage } from 'firebase-admin/storage';
import { getApps } from 'firebase-admin/app';

// Initialize Storage with error handling
let adminStorage: ReturnType<typeof getStorage> | undefined;

try {
  const apps = getApps();
  if (apps.length > 0) {
    adminStorage = getStorage(apps[0]);
    console.log('✅ Firebase Storage Admin initialized successfully');
  } else {
    console.warn('⚠️ Firebase Admin not initialized. Storage will not work.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Storage Admin:', error);
}

// Helper function to get storage bucket
export function getBucket() {
  if (!adminStorage) {
    throw new Error('Firebase Storage Admin not initialized');
  }
  return adminStorage.bucket();
}

export { adminStorage };
export default adminStorage;
