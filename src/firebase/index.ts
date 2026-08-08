import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { config, isDemoMode } from '../config';

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;

export const initializeFirebase = async () => {
  // Skip Firebase initialization in demo mode
  if (isDemoMode) {
    console.log('Demo mode: Firebase initialization skipped');
    return { app: null, auth: null, db: null, storage: null, messaging: null };
  }

  if (getApps().length === 0) {
    app = initializeApp(config.firebase);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  // Set auth persistence to local storage to persist across OAuth redirects
  await setPersistence(auth, browserLocalPersistence);
  db = getFirestore(app);
  storage = getStorage(app);

  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.warn('Firebase Messaging is not supported in this environment:', error);
    }
  }

  return { app, auth, db, storage, messaging };
};

export const getFirebaseApp = async () => {
  if (!app && !isDemoMode) {
    await initializeFirebase();
  }
  return app;
};

export const getFirebaseAuth = async () => {
  if (!auth && !isDemoMode) {
    await initializeFirebase();
  }
  return auth;
};

export const getFirebaseFirestore = async () => {
  if (!db && !isDemoMode) {
    await initializeFirebase();
  }
  return db;
};

export const getFirebaseStorage = async () => {
  if (!storage && !isDemoMode) {
    await initializeFirebase();
  }
  return storage;
};

export const getFirebaseMessaging = async () => {
  if (!messaging && !isDemoMode) {
    await initializeFirebase();
  }
  return messaging;
};
