import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-5518154130-8425e',
  appId: '1:100340407926:web:c54c84bf8e8920b0c88957',
  apiKey: 'AIzaSyDdHKEsl91dQcehqI-hRGY1Y5-KuLxQ0Fs',
  authDomain: 'studio-5518154130-8425e.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '100340407926',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db);
  } catch (err: any) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      console.warn('Firestore persistence failed: multiple tabs open');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore persistence not available in this browser.');
    }
  }
}

export { app, auth, db };
