import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth } from '../contexts/AuthContext';
import { isDemoMode } from '../config';
import { validateBusinessName } from '../utils/validators';
import { Loader2, ArrowRight, Check } from 'lucide-react';
import { getPlatformAdapter } from '../integrations';

type OnboardingStep = 'welcome' | 'create-business' | 'connect-accounts' | 'complete';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setBusiness, socialAccounts, refreshSocialAccounts } = useBusiness();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);

  // Business form state
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('Maldives');
  const [timezone, setTimezone] = useState('Indian/Maldives');

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBusinessName(businessName);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setLoading(true);
    try {
      // In demo mode, use demo business
      if (isDemoMode) {
        const demoBusiness = (await import('../services/demo')).demoBusiness;
        setBusiness(demoBusiness);
        setStep('connect-accounts');
      } else {
        // Production: Create business in Firestore
        // This would be implemented with actual Firestore create
        setStep('connect-accounts');
      }
    } catch (error) {
      console.error('Failed to create business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async (platform: string) => {
    setLoading(true);
    try {
      const adapter = getPlatformAdapter(platform as any);
      await adapter.connect();
      await refreshSocialAccounts();
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const steps = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'create-business', title: 'Create Business' },
    { id: 'connect-accounts', title: 'Connect Accounts' },
    { id: 'complete', title: 'Complete' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-hawa-blue">Hawa Social Hub</h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    index <= currentStepIndex
                      ? 'bg-hawa-blue text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-sm mt-2 text-gray-600 hidden sm:block">{s.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    index < currentStepIndex ? 'bg-hawa-blue' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === 'welcome' && (
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Hawa Social Hub, {user?.fullName}!
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Create Once. Publish Everywhere. Measure Everything. Let's get your business set up in just a few steps.
              </p>
              <button
                onClick={() => setStep('create-business')}
                className="bg-hawa-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-hawa-blue-dark transition flex items-center gap-2 mx-auto"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'create-business' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Business</h2>
              <form onSubmit={handleCreateBusiness} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                    placeholder="Your Business Name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                    disabled={loading}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="retail">Retail</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="travel">Travel</option>
                    <option value="hotel">Hotel</option>
                    <option value="events">Events</option>
                    <option value="education">Education</option>
                    <option value="government">Government</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                      placeholder="+960 123 4567"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                      placeholder="business@example.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                    placeholder="https://yourwebsite.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                    placeholder="Tell us about your business..."
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                      disabled={loading}
                    >
                      <option value="Maldives">Maldives</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hawa-blue focus:border-transparent outline-none"
                      disabled={loading}
                    >
                      <option value="Indian/Maldives">Indian/Maldives</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('welcome')}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-hawa-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-hawa-blue-dark transition flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'connect-accounts' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Social Accounts</h2>
              <p className="text-gray-600 mb-8">
                Connect your social media accounts to start publishing content.
              </p>

              <div className="space-y-4">
                {/* Facebook */}
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">f</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Facebook</h3>
                      {socialAccounts.find(a => a.platform === 'facebook') ? (
                        <p className="text-sm text-green-600">Connected</p>
                      ) : (
                        <p className="text-sm text-gray-500">Connect your Facebook Page</p>
                      )}
                    </div>
                  </div>
                  {socialAccounts.find(a => a.platform === 'facebook') ? (
                    <span className="text-green-600 font-medium">Connected</span>
                  ) : (
                    <button
                      onClick={() => handleConnectAccount('facebook')}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Connect
                    </button>
                  )}
                </div>

                {/* Instagram */}
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">IG</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Instagram</h3>
                      {socialAccounts.find(a => a.platform === 'instagram') ? (
                        <p className="text-sm text-green-600">Connected</p>
                      ) : (
                        <p className="text-sm text-gray-500">Connect your Instagram Business Account</p>
                      )}
                    </div>
                  </div>
                  {socialAccounts.find(a => a.platform === 'instagram') ? (
                    <span className="text-green-600 font-medium">Connected</span>
                  ) : (
                    <button
                      onClick={() => handleConnectAccount('instagram')}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      Connect
                    </button>
                  )}
                </div>

                {/* TikTok */}
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">TT</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">TikTok</h3>
                      {socialAccounts.find(a => a.platform === 'tiktok') ? (
                        <p className="text-sm text-green-600">Connected</p>
                      ) : (
                        <p className="text-sm text-gray-500">Connect your TikTok Account</p>
                      )}
                    </div>
                  </div>
                  {socialAccounts.find(a => a.platform === 'tiktok') ? (
                    <span className="text-green-600 font-medium">Connected</span>
                  ) : (
                    <button
                      onClick={() => handleConnectAccount('tiktok')}
                      disabled={loading}
                      className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-8">
                <button
                  onClick={() => setStep('create-business')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="bg-hawa-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-hawa-blue-dark transition flex items-center gap-2"
                >
                  Complete Setup
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Your business is ready. Start creating and publishing content to your connected social media accounts.
              </p>
              <button
                onClick={handleComplete}
                className="bg-hawa-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-hawa-blue-dark transition flex items-center gap-2 mx-auto"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
