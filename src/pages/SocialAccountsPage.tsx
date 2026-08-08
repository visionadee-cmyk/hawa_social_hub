import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth } from '../contexts/AuthContext';
import { getPlatformAdapter } from '../integrations';
import { isDemoMode } from '../config';
import { formatNumber, formatRelativeTime } from '../utils/formatters';
import { getFirebaseFirestore } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, CheckCircle, AlertCircle, RefreshCw, Link as LinkIcon, X, XCircle } from 'lucide-react';
import type { SocialPlatform } from '../types';

interface DemoAccount {
  id: string;
  name: string;
  followers: number;
}

const demoAccounts: Record<SocialPlatform, DemoAccount[]> = {
  facebook: [
    { id: 'fb-page-1', name: 'Hawa Group Official', followers: 12450 },
    { id: 'fb-page-2', name: 'Hawa Daily MV', followers: 8920 },
    { id: 'fb-page-3', name: 'Hawa Retail', followers: 5600 },
  ],
  instagram: [
    { id: 'ig-1', name: '@hawadailymv', followers: 8920 },
    { id: 'ig-2', name: '@hawagroup', followers: 15600 },
    { id: 'ig-3', name: '@hawaretail', followers: 4200 },
  ],
  tiktok: [
    { id: 'tt-1', name: '@hawadailymv', followers: 15600 },
    { id: 'tt-2', name: '@hawagroup', followers: 23400 },
    { id: 'tt-3', name: '@hawaretail', followers: 8900 },
  ],
};

export default function SocialAccountsPage() {
  const { socialAccounts, refreshSocialAccounts, removeSocialAccount, addSocialAccount } = useBusiness();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [showAccountSelector, setShowAccountSelector] = useState<SocialPlatform | null>(null);

  // Check for OAuth data in localStorage and write to Firestore
  useEffect(() => {
    if (isDemoMode) return;

    const platforms: SocialPlatform[] = ['facebook', 'instagram', 'tiktok'];
    
    platforms.forEach(async (platform) => {
      const oauthDataStr = localStorage.getItem(`oauth_${platform}`);
      console.log(`[OAuth Debug] Checking for OAuth data for ${platform}:`, oauthDataStr ? 'Found' : 'Not found');
      
      if (oauthDataStr) {
        try {
          const oauthData = JSON.parse(oauthDataStr);
          console.log('[OAuth Debug] Parsed OAuth data:', oauthData);
          
          const db = getFirebaseFirestore();
          console.log('[OAuth Debug] Firestore instance:', db ? 'Initialized' : 'Not initialized');
          
          if (!db) {
            console.error('[OAuth Debug] Firestore not initialized');
            return;
          }
          
          if (!oauthData.userId) {
            console.error('[OAuth Debug] No userId in OAuth data');
            return;
          }

          const docId = `${oauthData.userId}_${platform}`;
          console.log('[OAuth Debug] Document ID:', docId);
          
          const socialAccountRef = doc(db, 'socialAccounts', docId);
          console.log('[OAuth Debug] Document reference created');
          
          // Skip getDoc to avoid read permission issues - just write directly
          console.log('[OAuth Debug] Skipping getDoc to avoid read permission issues');
          
          const accountData = {
            ...oauthData,
            status: 'connected',
            followers: oauthData.followers || 0,
            accountName: oauthData.accountName || oauthData.pageName || oauthData.username || `${platform.charAt(0).toUpperCase() + platform.slice(1)} Page`,
            businessId: oauthData.userId,
            accountId: docId,
            createdAt: oauthData.connectedAt ? new Date(oauthData.connectedAt) : new Date(),
            updatedAt: new Date(),
          };
          console.log('[OAuth Debug] Data to write:', accountData);

          await setDoc(socialAccountRef, accountData, { merge: true });
          console.log('[OAuth Debug] Successfully wrote to Firestore');
          
          // Clear the OAuth data from localStorage after successful write
          localStorage.removeItem(`oauth_${platform}`);
          
          // Refresh social accounts to show the new connection
          refreshSocialAccounts();
        } catch (err) {
          console.error('[OAuth Debug] Failed to write OAuth data to Firestore:', err);
          console.error('[OAuth Debug] Error details:', {
            message: (err as Error).message,
            code: (err as any).code,
            details: (err as any).details
          });
        }
      }
    });
  }, [refreshSocialAccounts]);

  const handleConnect = (platform: SocialPlatform) => {
    // Check if user is authenticated before connecting social media
    if (!isDemoMode && !user) {
      setError('Please log in first to connect social media accounts');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (isDemoMode) {
      setShowAccountSelector(platform);
    } else {
      // Production mode: initiate OAuth
      setLoading(prev => ({ ...prev, [platform]: true }));
      getPlatformAdapter(platform).connect();
    }
  };

  const handleSelectAccount = async (platform: SocialPlatform, demoAccount: DemoAccount) => {
    setLoading(prev => ({ ...prev, [demoAccount.id]: true }));
    setError(null);

    try {
      const adapter = getPlatformAdapter(platform);
      const account = await adapter.connect();
      
      if (account) {
        // Override with selected demo account details
        const updatedAccount = {
          ...account,
          id: demoAccount.id,
          accountName: demoAccount.name,
          followers: demoAccount.followers,
        };
        addSocialAccount(updatedAccount);
      }
    } catch (err: any) {
      setError(err.message || `Failed to connect ${platform}`);
    } finally {
      setLoading(prev => ({ ...prev, [demoAccount.id]: false }));
      setShowAccountSelector(null);
    }
  };

  const handleDisconnect = async (accountId: string, platform: SocialPlatform) => {
    if (!confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
      return;
    }

    setLoading(prev => ({ ...prev, [accountId]: true }));
    setError(null);

    try {
      const adapter = getPlatformAdapter(platform);
      await adapter.disconnect(accountId);
      
      if (isDemoMode) {
        // Remove from state in demo mode
        removeSocialAccount(accountId);
      } else {
        await refreshSocialAccounts();
      }
    } catch (err: any) {
      setError(err.message || `Failed to disconnect ${platform}`);
    } finally {
      setLoading(prev => ({ ...prev, [accountId]: false }));
    }
  };

  const handleRefresh = async (accountId: string, platform: SocialPlatform) => {
    setLoading(prev => ({ ...prev, [accountId]: true }));
    setError(null);

    try {
      const adapter = getPlatformAdapter(platform);
      await adapter.syncAnalytics(accountId);
      await refreshSocialAccounts();
    } catch (err: any) {
      setError(err.message || `Failed to refresh ${platform}`);
    } finally {
      setLoading(prev => ({ ...prev, [accountId]: false }));
    }
  };

  const platforms: SocialPlatform[] = ['facebook', 'instagram', 'tiktok'];

  const getPlatformInfo = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return {
          name: 'Facebook',
          color: 'bg-blue-600',
          icon: 'f',
          description: 'Connect your Facebook Page to publish posts and view analytics.',
        };
      case 'instagram':
        return {
          name: 'Instagram',
          color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
          icon: 'IG',
          description: 'Connect your Instagram Business Account to publish posts and view analytics.',
        };
      case 'tiktok':
        return {
          name: 'TikTok',
          color: 'bg-black',
          icon: 'TT',
          description: 'Connect your TikTok account to publish videos and view analytics.',
        };
    }
  };

  const getConnectionStatus = (account: any) => {
    switch (account.status) {
      case 'connected':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CheckCircle,
          label: 'Connected',
        };
      case 'disconnected':
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: X,
          label: 'Disconnected',
        };
      case 'expired':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: AlertCircle,
          label: 'Authorization Expired',
        };
      case 'error':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: AlertCircle,
          label: 'Connection Error',
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: X,
          label: 'Not Connected',
        };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Accounts</h1>
        <p className="text-gray-600">Connect and manage your social media accounts</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {isDemoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Account connections are simulated. In production mode, you'll connect real social media accounts using OAuth.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const account = socialAccounts.find(a => a.platform === platform);
          const info = getPlatformInfo(platform);
          const status = account ? getConnectionStatus(account) : null;
          const StatusIcon = status?.icon || X;

          return (
            <div key={platform} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className={`p-6 ${info.color} text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{info.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{info.name}</h2>
                    {account && (
                      <p className="text-sm opacity-90">{account.accountName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {account ? (
                  <div className="space-y-4">
                    {/* Status */}
                    <div className={`flex items-center gap-2 ${status?.color}`}>
                      <StatusIcon className="w-5 h-5" />
                      <span className="font-medium">{status?.label}</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Followers</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatNumber(account.followers || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Sync</p>
                        <p className="text-sm font-medium text-gray-900">
                          {account.lastSyncAt ? formatRelativeTime(account.lastSyncAt) : 'Never'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRefresh(account.id, platform)}
                        disabled={loading[account.id]}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        {loading[account.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        Refresh
                      </button>
                      <button
                        onClick={() => handleDisconnect(account.id, platform)}
                        disabled={loading[account.id]}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {loading[account.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">{info.description}</p>
                    <button
                      onClick={() => handleConnect(platform)}
                      disabled={loading[platform]}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-hawa-blue text-white rounded-lg hover:bg-hawa-blue-dark transition disabled:opacity-50"
                    >
                      {loading[platform] ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <LinkIcon className="w-5 h-5" />
                      )}
                      Connect {info.name}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Health Section */}
      {socialAccounts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Health</h2>
          <div className="space-y-3">
            {socialAccounts.map((account) => {
              const info = getPlatformInfo(account.platform);
              const status = getConnectionStatus(account);
              const StatusIcon = status.icon;

              return (
                <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${info.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold">{info.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{account.accountName}</p>
                      <p className="text-sm text-gray-500">{info.name}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${status.color}`}>
                    <StatusIcon className="w-5 h-5" />
                    <span className="font-medium">{status.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Account Selector Modal */}
      {showAccountSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Select {getPlatformInfo(showAccountSelector).name} Account
                </h2>
                <button
                  onClick={() => setShowAccountSelector(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Choose which account you want to connect to Hawa Social Hub
              </p>
              <div className="space-y-2">
                {demoAccounts[showAccountSelector].map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleSelectAccount(showAccountSelector, account)}
                    disabled={loading[account.id]}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${getPlatformInfo(showAccountSelector).color} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold">{getPlatformInfo(showAccountSelector).icon}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{account.name}</p>
                        <p className="text-sm text-gray-500">{formatNumber(account.followers)} followers</p>
                      </div>
                    </div>
                    {loading[account.id] ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    ) : (
                      <LinkIcon className="w-5 h-5 text-hawa-blue" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
