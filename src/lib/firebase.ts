import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export { app, auth, db };
