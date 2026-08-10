import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isDemoMode } from '../config';
import { demoBusiness, demoSocialAccounts } from '../services/demo';
import { getFirebaseFirestore } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Business, SocialAccount } from '../types';

interface BusinessContextType {
  business: Business | null;
  socialAccounts: SocialAccount[];
  loading: boolean;
  setBusiness: (business: Business | null) => void;
  refreshSocialAccounts: () => Promise<void>;
  removeSocialAccount: (accountId: string) => void;
  addSocialAccount: (account: SocialAccount) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusinessState] = useState<Business | null>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode: Use demo business and accounts
      setBusinessState(demoBusiness);
      setSocialAccounts([...demoSocialAccounts]);
      setLoading(false);
      return;
    }

    // Production: Fetch business and social accounts from Firestore
    const loadInitialData = async () => {
      await refreshSocialAccounts();
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const setBusiness = (business: Business | null) => {
    setBusinessState(business);
    if (business && isDemoMode) {
      setSocialAccounts([...demoSocialAccounts]);
    }
  };

  const refreshSocialAccounts = async () => {
    if (isDemoMode) {
      // Don't reset - keep current state
      return;
    }

    const db = getFirebaseFirestore();
    if (!db) return;

    try {
      // Get current user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('No userId found in localStorage, cannot fetch social accounts');
        return;
      }

      // Fetch social accounts for this user only
      const socialAccountsRef = collection(db, 'socialAccounts');
      const snapshot = await getDocs(socialAccountsRef);
      
      const accounts: SocialAccount[] = snapshot.docs
        .filter(doc => doc.data().userId === userId)
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            businessId: data.businessId || data.userId || '',
            platform: data.platform,
            accountId: data.accountId || doc.id,
            accountName: data.accountName || data.pageName || data.username || 'Unknown',
            username: data.username,
            profileImage: data.profileImage,
            followers: data.followers || 0,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tokenExpiresAt: data.tokenExpiresAt,
            status: data.status || 'connected',
            lastSyncAt: data.lastSyncAt || null,
            lastSuccessfulPostAt: data.lastSuccessfulPostAt || null,
            connectionError: data.connectionError,
            createdAt: data.createdAt || data.connectedAt ? new Date(data.connectedAt) : new Date(),
            updatedAt: data.updatedAt || new Date(),
          };
        });

      setSocialAccounts(accounts);
      console.log('[BusinessContext] Refreshed social accounts:', accounts.length);
    } catch (error) {
      console.error('Failed to refresh social accounts:', error);
    }
  };

  const removeSocialAccount = (accountId: string) => {
    setSocialAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };

  const addSocialAccount = (account: SocialAccount) => {
    setSocialAccounts(prev => [...prev, account]);
  };

  const value: BusinessContextType = {
    business,
    socialAccounts,
    loading,
    setBusiness,
    refreshSocialAccounts,
    removeSocialAccount,
    addSocialAccount,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
