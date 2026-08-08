import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { initializeFirebase } from './firebase';
import { logEnvironmentValidation } from './utils/validateEnv';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CreatePostPage from './pages/CreatePostPage';
import SocialAccountsPage from './pages/SocialAccountsPage';
import FacebookCallbackPage from './pages/FacebookCallbackPage';
import InstagramCallbackPage from './pages/InstagramCallbackPage';
import TikTokCallbackPage from './pages/TikTokCallbackPage';

// Validate environment configuration
logEnvironmentValidation();

function App() {
  // Initialize Firebase asynchronously
  useEffect(() => {
    initializeFirebase();
  }, []);
  return (
    <BrowserRouter>
      <AuthProvider>
        <BusinessProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* OAuth Callback Routes */}
            <Route path="/auth/callback/facebook" element={<FacebookCallbackPage />} />
            <Route path="/auth/callback/instagram" element={<InstagramCallbackPage />} />
            <Route path="/auth/callback/tiktok" element={<TikTokCallbackPage />} />

            {/* Protected Routes */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create-post" element={<CreatePostPage />} />
              <Route path="/social-accounts" element={<SocialAccountsPage />} />
              <Route path="/calendar" element={<div className="p-8"><h1 className="text-2xl font-bold">Calendar</h1><p className="text-gray-600">Content calendar coming soon</p></div>} />
              <Route path="/posts" element={<div className="p-8"><h1 className="text-2xl font-bold">Posts</h1><p className="text-gray-600">Posts page coming soon</p></div>} />
              <Route path="/analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-gray-600">Analytics page coming soon</p></div>} />
              <Route path="/campaigns" element={<div className="p-8"><h1 className="text-2xl font-bold">Campaigns</h1><p className="text-gray-600">Campaigns page coming soon</p></div>} />
              <Route path="/media" element={<div className="p-8"><h1 className="text-2xl font-bold">Media Library</h1><p className="text-gray-600">Media library coming soon</p></div>} />
              <Route path="/team" element={<div className="p-8"><h1 className="text-2xl font-bold">Team</h1><p className="text-gray-600">Team management coming soon</p></div>} />
              <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Settings page coming soon</p></div>} />
              <Route path="/profile" element={<div className="p-8"><h1 className="text-2xl font-bold">Profile</h1><p className="text-gray-600">Profile page coming soon</p></div>} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BusinessProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
