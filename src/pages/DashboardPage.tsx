import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import { isDemoMode } from '../config';
import { generateDemoAnalytics, demoPosts } from '../services/demo';
import { formatNumber, formatPercentage } from '../utils/formatters';
import { getDateRangeFromPreset } from '../utils/date';
import { TrendingUp, TrendingDown, Calendar, Users, Eye, Heart, MessageCircle, Share2, Play, PlusCircle, BarChart3 } from 'lucide-react';
import type { DateRangePreset } from '../types';

const datePresets: { value: DateRangePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_90_days', label: 'Last 90 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
];

interface MetricCardProps {
  title: string;
  value: string;
  previousValue: string;
  change: number;
  icon: React.ReactNode;
}

function MetricCard({ title, value, previousValue, change, icon }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-hawa-blue/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">{formatPercentage(change)}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">Previous: {previousValue}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { socialAccounts } = useBusiness();
  const [datePreset, setDatePreset] = useState<DateRangePreset>('last_7_days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Calculate demo metrics
  const calculateMetrics = () => {
    if (!isDemoMode) return null;

    getDateRangeFromPreset(datePreset);

    // Get analytics for current period
    const fbAnalytics = generateDemoAnalytics('demo-business-1', 'facebook', 7);
    const igAnalytics = generateDemoAnalytics('demo-business-1', 'instagram', 7);
    const ttAnalytics = generateDemoAnalytics('demo-business-1', 'tiktok', 7);

    const currentFb = fbAnalytics[fbAnalytics.length - 1]?.metrics;
    const currentIg = igAnalytics[igAnalytics.length - 1]?.metrics;
    const currentTt = ttAnalytics[ttAnalytics.length - 1]?.metrics;

    const totalFollowers = (currentFb?.followers || 0) + (currentIg?.followers || 0) + (currentTt?.followers || 0);
    const totalReach = (currentFb?.reach || 0) + (currentIg?.reach || 0) + (currentTt?.reach || 0);
    const totalImpressions = (currentFb?.impressions || 0) + (currentIg?.impressions || 0) + (currentTt?.impressions || 0);
    const totalLikes = (currentFb?.likes || 0) + (currentIg?.likes || 0) + (currentTt?.likes || 0);
    const totalComments = (currentFb?.comments || 0) + (currentIg?.comments || 0) + (currentTt?.comments || 0);
    const totalShares = (currentFb?.shares || 0) + (currentIg?.shares || 0) + (currentTt?.shares || 0);
    const totalViews = (currentFb?.views || 0) + (currentIg?.views || 0) + (currentTt?.views || 0);

    return {
      totalFollowers,
      totalReach,
      totalImpressions,
      totalLikes,
      totalComments,
      totalShares,
      totalViews,
      postsPublished: demoPosts.length,
    };
  };

  const metrics = calculateMetrics();

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available yet.</p>
        <p className="text-sm text-gray-500 mt-2">Connect your social accounts to start collecting data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullName}</p>
        </div>

        {/* Date Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium">
              {datePresets.find(p => p.value === datePreset)?.label}
            </span>
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {datePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    setDatePreset(preset.value);
                    setShowDateDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition first:rounded-t-lg last:rounded-b-lg"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Connected Accounts Summary */}
      {socialAccounts.length > 0 && (
        <div className="bg-gradient-to-r from-hawa-blue to-hawa-blue-dark rounded-xl p-6 text-white">
          <h2 className="font-semibold mb-4">Connected Accounts</h2>
          <div className="flex flex-wrap gap-4">
            {socialAccounts.map((account) => (
              <div key={account.id} className="flex items-center gap-3 bg-white/20 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-hawa-blue font-bold text-sm">
                    {account.platform.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{account.accountName}</p>
                  <p className="text-xs opacity-80">{formatNumber(account.followers || 0)} followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Followers"
          value={formatNumber(metrics.totalFollowers)}
          previousValue={formatNumber(Math.floor(metrics.totalFollowers * 0.95))}
          change={5.2}
          icon={<Users className="w-6 h-6 text-hawa-blue" />}
        />
        <MetricCard
          title="Total Reach"
          value={formatNumber(metrics.totalReach)}
          previousValue={formatNumber(Math.floor(metrics.totalReach * 0.88))}
          change={12.5}
          icon={<Eye className="w-6 h-6 text-hawa-blue" />}
        />
        <MetricCard
          title="Total Impressions"
          value={formatNumber(metrics.totalImpressions)}
          previousValue={formatNumber(Math.floor(metrics.totalImpressions * 0.92))}
          change={8.7}
          icon={<Eye className="w-6 h-6 text-hawa-blue" />}
        />
        <MetricCard
          title="Total Likes"
          value={formatNumber(metrics.totalLikes)}
          previousValue={formatNumber(Math.floor(metrics.totalLikes * 0.85))}
          change={15.3}
          icon={<Heart className="w-6 h-6 text-hawa-red" />}
        />
        <MetricCard
          title="Total Comments"
          value={formatNumber(metrics.totalComments)}
          previousValue={formatNumber(Math.floor(metrics.totalComments * 0.9))}
          change={11.1}
          icon={<MessageCircle className="w-6 h-6 text-hawa-blue" />}
        />
        <MetricCard
          title="Total Shares"
          value={formatNumber(metrics.totalShares)}
          previousValue={formatNumber(Math.floor(metrics.totalShares * 0.87))}
          change={14.9}
          icon={<Share2 className="w-6 h-6 text-hawa-blue" />}
        />
        <MetricCard
          title="Video Views"
          value={formatNumber(metrics.totalViews)}
          previousValue={formatNumber(Math.floor(metrics.totalViews * 0.82))}
          change={21.8}
          icon={<Play className="w-6 h-6 text-hawa-blue" />}
        />
        <MetricCard
          title="Posts Published"
          value={metrics.postsPublished.toString()}
          previousValue={Math.floor(metrics.postsPublished * 0.8).toString()}
          change={25.0}
          icon={<Calendar className="w-6 h-6 text-hawa-blue" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
            <div className="w-10 h-10 bg-hawa-blue rounded-lg flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Create Post</p>
              <p className="text-sm text-gray-500">Publish to all platforms</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
            <div className="w-10 h-10 bg-hawa-red rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Schedule Post</p>
              <p className="text-sm text-gray-500">Plan your content</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
            <div className="w-10 h-10 bg-hawa-blue rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Detailed insights</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left">
            <div className="w-10 h-10 bg-hawa-blue rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Accounts</p>
              <p className="text-sm text-gray-500">Connect platforms</p>
            </div>
          </button>
        </div>
      </div>

      {isDemoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> All data shown is simulated for demonstration purposes. Connect real social media accounts in production mode to see actual analytics.
          </p>
        </div>
      )}
    </div>
  );
}
