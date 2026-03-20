// Firebase Storage Helper (Client-side)
import { getStorage, FirebaseStorage } from 'firebase/storage';
import app from './firebase';

const storage: FirebaseStorage = getStorage(app);

export { storage };
export default storage;
