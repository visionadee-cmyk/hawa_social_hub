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
        const db = getFirebaseFirestore();
        if (!db) {
          throw new Error('Firestore not initialized');
        }

        // Check Firebase auth state directly
        const auth = getFirebaseAuth();
        const currentUser = auth?.currentUser;
        
        console.log('Firebase auth state:', { currentUser, userId: currentUser?.uid });
        
        if (!currentUser) {
          // User not authenticated in Firebase, redirect to login with OAuth code
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

        const userId = currentUser.uid;

        // Store the OAuth code temporarily (in production, exchange for token on backend)
        const socialAccountRef = doc(db, 'socialAccounts', `${userId}_${platform}`);
        const existingDoc = await getDoc(socialAccountRef);

        const accountData = {
          userId,
          platform,
          authCode: code,
          state,
          connectedAt: new Date().toISOString(),
          status: 'pending_token_exchange',
          ...(existingDoc.exists() ? existingDoc.data() : {}),
        };

        await setDoc(socialAccountRef, accountData);

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
