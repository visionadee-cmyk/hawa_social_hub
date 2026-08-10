import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getFirebaseFirestore, getFirebaseAuth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { isDemoMode } from '../config';

type Platform = 'facebook' | 'instagram' | 'tiktok';

interface OAuthCallbackPageProps {
  platform: Platform;
}

export default function OAuthCallbackPage({ platform }: OAuthCallbackPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      if (isDemoMode) {
        // Demo mode: simulate successful connection
        setStatus('success');
        setTimeout(() => {
          navigate('/social-accounts', { replace: true });
        }, 2000);
        return;
      }

      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        setStatus('error');
        setErrorMessage(error);
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorMessage('No authorization code received');
        return;
      }

      try {
        // Use localStorage userId instead of Firebase auth state
        const userId = localStorage.getItem('userId');
        
        console.log('OAuth callback userId from localStorage:', userId);
        
        if (!userId) {
          // User not authenticated, redirect to login with OAuth code
          const code = searchParams.get('code');
          const state = searchParams.get('state');
          
          // Store OAuth data temporarily
          sessionStorage.setItem('pending_oauth_code', code || '');
          sessionStorage.setItem('pending_oauth_state', state || '');
          sessionStorage.setItem('pending_oauth_platform', platform);
          
          setStatus('error');
          setErrorMessage('Please log in first to connect your account');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        // For Facebook/Instagram, try to fetch page details using Graph API
        if (platform === 'facebook') {
          try {
            // Exchange code for access token using client-side flow (not recommended for production)
            const tokenResponse = await fetch(
              `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${import.meta.env.VITE_META_APP_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback/' + platform)}&client_secret=${import.meta.env.VITE_META_APP_SECRET}&code=${code}`
            );
            const tokenData = await tokenResponse.json();

            if (tokenData.error) {
              throw new Error(tokenData.error.message);
            }

            // Fetch user's pages
            const pagesResponse = await fetch(
              `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`
            );
            const pagesData = await pagesResponse.json();

            console.log('[OAuth Facebook] Pages returned:', pagesData.data?.map(p => ({ id: p.id, name: p.name })));
            console.log('[OAuth Facebook] All page names:', pagesData.data?.map(p => p.name).join(', '));

            if (pagesData.data && pagesData.data.length > 0) {
              // Try to find a known Hawa page by ID first, then by name (case-insensitive), otherwise use first page
              const hawaPageIds = ['1233961369780982', '61591869200851'];
              const hawaDailyPage = pagesData.data.find(p => hawaPageIds.includes(p.id)) ||
                                    pagesData.data.find(p => p.name.toLowerCase().includes('hawa daily'));
              const page = hawaDailyPage || pagesData.data[0];
              console.log('[OAuth Facebook] Selected page:', page.name, 'ID:', page.id);
              console.log('[OAuth Facebook] Selected page object:', page);

              // Fetch page info for follower count
              let followers = 0;
              try {
                const pageInfoResponse = await fetch(
                  `https://graph.facebook.com/v18.0/${page.id}?fields=fan_count,followers_count&access_token=${tokenData.access_token}`
                );
                const pageInfoData = await pageInfoResponse.json();
                console.log('[OAuth Facebook] Page info response:', pageInfoData);
                followers = pageInfoData.fan_count || pageInfoData.followers_count || 0;
                console.log('[OAuth Facebook] Followers count:', followers);
              } catch (pageError) {
                console.error('[OAuth] Failed to fetch page info:', pageError);
              }
              
              const oauthData = {
                userId,
                platform,
                accessToken: tokenData.access_token,
                pageId: page.id,
                pageName: page.name,
                accountName: page.name,
                followers: followers,
                state,
                connectedAt: new Date().toISOString(),
                status: 'connected',
              };
              
              localStorage.setItem(`oauth_${platform}`, JSON.stringify(oauthData));
              console.log('[OAuth] Successfully fetched page details:', page.name, 'Followers:', followers);
            } else {
              console.log('[OAuth Facebook] No Facebook pages found, fetching user profile');
              // Fallback: Fetch user's profile name
              let accountName = 'Facebook Page';
              try {
                const userResponse = await fetch(
                  `https://graph.facebook.com/v18.0/me?fields=name&access_token=${tokenData.access_token}`
                );
                const userData = await userResponse.json();
                if (userData.name) {
                  accountName = userData.name;
                  console.log('[OAuth Facebook] User profile name:', accountName);
                }
              } catch (userError) {
                console.error('[OAuth Facebook] Failed to fetch user profile:', userError);
              }
              
              const oauthData = {
                userId,
                platform,
                accessToken: tokenData.access_token,
                accountName,
                followers: 0,
                state,
                connectedAt: new Date().toISOString(),
                status: 'connected',
              };
              
              localStorage.setItem(`oauth_${platform}`, JSON.stringify(oauthData));
            }
          } catch (error) {
            console.error('[OAuth] Failed to fetch Facebook page details:', error);
            // Fallback to basic OAuth data
            const oauthData = {
              userId,
              platform,
              authCode: code,
              state,
              connectedAt: new Date().toISOString(),
              status: 'pending_token_exchange',
            };
            
            localStorage.setItem(`oauth_${platform}`, JSON.stringify(oauthData));
          }
        } else if (platform === 'instagram') {
          try {
            // Exchange code for access token
            const tokenResponse = await fetch(
              `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${import.meta.env.VITE_META_APP_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback/instagram')}&client_secret=${import.meta.env.VITE_META_APP_SECRET}&code=${code}`
            );
            const tokenData = await tokenResponse.json();

            if (tokenData.error) {
              throw new Error(tokenData.error.message);
            }

            console.log('[OAuth Instagram] Access token obtained');

            // First, try to get the user's Instagram business account directly
            const userResponse = await fetch(
              `https://graph.facebook.com/v18.0/me?fields=instagram_business_account{id,name,username,profile_picture_url,followers_count}&access_token=${tokenData.access_token}`
            );
            const userData = await userResponse.json();

            console.log('[OAuth Instagram] User response:', userData);

            let igAccount = null;
            let pageName = 'Instagram Business Account';
            let pageId = '';

            // Check if user has Instagram business account directly
            if (userData.instagram_business_account) {
              igAccount = userData.instagram_business_account;
              console.log('[OAuth Instagram] Found Instagram business account directly:', igAccount);
            } else {
              // Fallback: Try to get Facebook pages with Instagram accounts
              const igResponse = await fetch(
                `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account{id,name,username,profile_picture_url,followers_count}&access_token=${tokenData.access_token}`
              );
              const igData = await igResponse.json();

              console.log('[OAuth Instagram] Pages response:', igData);
              console.log('[OAuth Instagram] Pages returned:', igData.data?.map(p => ({ id: p.id, name: p.name })));
              console.log('[OAuth Instagram] All page names:', igData.data?.map(p => p.name).join(', '));

              if (igData.data && igData.data.length > 0) {
                // Try to find Hawa Daily page by ID first, then by name (case-insensitive), otherwise use first page
                const hawaDailyPage = igData.data.find(p => p.id === '1233961369780982') ||
                                      igData.data.find(p => p.name.toLowerCase().includes('hawa daily'));
                const page = hawaDailyPage || igData.data[0];
                console.log('[OAuth Instagram] Selected page:', page.name, 'ID:', page.id);
                pageName = page.name;
                pageId = page.id;
                igAccount = page.instagram_business_account;
              }
            }

            if (igAccount) {
              const oauthData = {
                userId,
                platform,
                accessToken: tokenData.access_token,
                pageId: pageId,
                pageName: pageName,
                instagramAccountId: igAccount.id,
                accountName: igAccount.username || igAccount.name || `@${igAccount.username || 'instagram'}`,
                username: igAccount.username,
                profileImage: igAccount.profile_picture_url,
                followers: igAccount.followers_count || 0,
                state,
                connectedAt: new Date().toISOString(),
                status: 'connected',
              };
              
              localStorage.setItem(`oauth_${platform}`, JSON.stringify(oauthData));
              console.log('[OAuth Instagram] Successfully fetched Instagram account:', igAccount.username, 'Followers:', igAccount.followers_count);
            } else {
              console.log('[OAuth Instagram] No Instagram business account found, using default name');
              // Fallback to basic OAuth data with default name
              const oauthData = {
                userId,
                platform,
                accessToken: tokenData.access_token,
                accountName: 'Instagram Business Account',
                followers: 0,
                state,
                connectedAt: new Date().toISOString(),
                status: 'connected',
              };
              
              localStorage.setItem(`oauth_${platform}`, JSON.stringify(oauthData));
            }
          } catch (error) {
            console.error('[OAuth Instagram] Failed to fetch Instagram account details:', error);
            // Fallback to basic OAuth data with default name
            const oauthData = {
              userId,
              platform,
              authCode: code,
              accountName: 'Instagram Business Account',
              state,
              connectedAt: new Date().toISOString(),
              status: 'pending_token_exchange',
            };
            
            localStorage.setItem(`oauth_${platform}`, JSON.stringify(oauthData));
          }
        } else {
          // TikTok or other platforms - store basic OAuth data
          const oauthData = {
            userId,
            platform,
            authCode: code,
            state,
            connectedAt: new Date().toISOString(),
            status: 'pending_token_exchange',
          };
          
          localStorage.setItem(`oauth_${platform}`, JSON.stringify(oauthData));
        }

        setStatus('success');
        
        // Redirect to social accounts page after 2 seconds
        setTimeout(() => {
          navigate('/social-accounts', { replace: true });
        }, 2000);
      } catch (err) {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Failed to connect account');
      }
    };

    handleCallback();
  }, [searchParams, navigate, platform]);

  const getPlatformName = () => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'tiktok':
        return 'TikTok';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-hawa-blue mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connecting to {getPlatformName()}...
            </h2>
            <p className="text-gray-600">Please wait while we complete the connection.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Successfully Connected!
            </h2>
            <p className="text-gray-600">
              Your {getPlatformName()} account has been connected successfully.
            </p>
            <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => navigate('/social-accounts')}
              className="bg-hawa-blue text-white px-6 py-2 rounded-lg hover:bg-hawa-blue-dark transition-colors"
            >
              Return to Social Accounts
            </button>
          </>
        )}
      </div>
    </div>
  );
}
