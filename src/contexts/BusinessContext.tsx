import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isDemoMode } from '../config';
import { demoBusiness, demoSocialAccounts } from '../services/demo';
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
    // This would be implemented with actual Firestore queries
    setLoading(false);
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
    // Production: Refresh from Firestore
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
