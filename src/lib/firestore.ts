// Firestore Database Helper (Client-side)
import { getFirestore, Firestore } from 'firebase/firestore';
import app from './firebase';

const db: Firestore = getFirestore(app);

export { db };
export default db;
