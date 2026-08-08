import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { authService } from '../firebase/auth';
import { isDemoMode } from '../config';
import { demoUser } from '../services/demo';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode: Use demo user
      setUser(demoUser);
      setLoading(false);
      return;
    }

    // Production: Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user data from Firestore
        // For now, create a basic user object from Firebase user
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          fullName: firebaseUser.displayName || '',
          profileImage: firebaseUser.photoURL || undefined,
          emailVerified: firebaseUser.emailVerified,
          createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
          lastLoginAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
        };
        setUser(userData);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (isDemoMode) {
      setUser(demoUser);
      localStorage.setItem('userId', demoUser.id);
      return;
    }
    const firebaseUser = await authService.signInWithEmail(email, password);
    localStorage.setItem('userId', firebaseUser.uid);
  };

  const registerWithEmail = async (email: string, password: string, fullName: string) => {
    if (isDemoMode) {
      setUser(demoUser);
      localStorage.setItem('userId', demoUser.id);
      return;
    }
    const firebaseUser = await authService.registerWithEmail(email, password, fullName);
    localStorage.setItem('userId', firebaseUser.uid);
  };

  const signInWithGoogle = async () => {
    if (isDemoMode) {
      setUser(demoUser);
      localStorage.setItem('userId', demoUser.id);
      return;
    }
    const firebaseUser = await authService.signInWithGoogle();
    localStorage.setItem('userId', firebaseUser.uid);
  };

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
      localStorage.removeItem('userId');
      return;
    }
    await authService.signOut();
    localStorage.removeItem('userId');
  };

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      return;
    }
    await authService.resetPassword(email);
  };

  const resendVerificationEmail = async () => {
    if (isDemoMode) {
      return;
    }
    await authService.resendVerificationEmail();
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signInWithEmail,
    registerWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
