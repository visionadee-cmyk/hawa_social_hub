import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';
import { config, isDemoMode } from '../config';

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;

export const initializeFirebase = () => {
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

export const getFirebaseApp = () => {
  if (!app && !isDemoMode) {
    initializeFirebase();
  }
  return app;
};

export const getFirebaseAuth = () => {
  if (!auth && !isDemoMode) {
    initializeFirebase();
  }
  return auth;
};

export const getFirebaseFirestore = () => {
  if (!db && !isDemoMode) {
    initializeFirebase();
  }
  return db;
};

export const getFirebaseStorage = () => {
  if (!storage && !isDemoMode) {
    initializeFirebase();
  }
  return storage;
};

export const getFirebaseMessaging = () => {
  if (!messaging && !isDemoMode) {
    initializeFirebase();
  }
  return messaging;
};
