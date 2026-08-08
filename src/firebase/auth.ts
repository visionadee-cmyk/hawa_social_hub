import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from './index';
import type { User } from '../types';

let auth: ReturnType<typeof getFirebaseAuth> | null = null;
let db: ReturnType<typeof getFirebaseFirestore> | null = null;

// Initialize Firebase auth and db
const initializeFirebaseServices = async () => {
  if (!auth) {
    auth = await getFirebaseAuth();
  }
  if (!db) {
    db = await getFirebaseFirestore();
  }
};

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async signInWithEmail(email: string, password: string) {
    await initializeFirebaseServices();
    const userCredential = await signInWithEmailAndPassword(auth!, email, password);
    return userCredential.user;
  },

  async registerWithEmail(email: string, password: string, fullName: string) {
    await initializeFirebaseServices();
    const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
    
    await updateProfile(userCredential.user, { displayName: fullName });
    await sendEmailVerification(userCredential.user);

    const userDoc: User = {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      fullName,
      emailVerified: false,
      createdAt: new Date(),
    };

    await setDoc(doc(db!, 'users', userCredential.user.uid), userDoc);

    return userCredential.user;
  },

  async signInWithGoogle() {
    await initializeFirebaseServices();
    const userCredential = await signInWithPopup(auth!, googleProvider);
    
    const userDocRef = doc(db!, 'users', userCredential.user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const newUser: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        fullName: userCredential.user.displayName || '',
        profileImage: userCredential.user.photoURL || undefined,
        emailVerified: userCredential.user.emailVerified || true,
        createdAt: new Date(),
      };

      await setDoc(userDocRef, newUser);
    }

    return userCredential.user;
  },

  async signOut() {
    await initializeFirebaseServices();
    await firebaseSignOut(auth!);
  },

  async resetPassword(email: string) {
    await initializeFirebaseServices();
    await sendPasswordResetEmail(auth!, email);
  },

  async resendVerificationEmail() {
    await initializeFirebaseServices();
    const user = auth!.currentUser;
    if (user) {
      await sendEmailVerification(user);
    }
  },

  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth!, callback);
  },

  getCurrentUser(): FirebaseUser | null {
    return auth?.currentUser || null;
  },
};
