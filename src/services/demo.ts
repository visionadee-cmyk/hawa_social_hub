import type { SocialAccount, PostAnalytics, AnalyticsSnapshot } from '../types';

// Demo social accounts
export const demoSocialAccounts: SocialAccount[] = [
  {
    id: 'demo-facebook-1',
    businessId: 'demo-business-1',
    platform: 'facebook',
    accountId: 'demo-fb-page-123',
    accountName: 'Hawa Group Official',
    username: 'hawagroup',
    profileImage: 'https://via.placeholder.com/150/0066CC/FFFFFF?text=FB',
    followers: 12450,
    status: 'connected',
    lastSyncAt: new Date(Date.now() - 3600000),
    lastSuccessfulPostAt: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 2592000000),
    updatedAt: new Date(),
  },
  {
    id: 'demo-instagram-1',
    businessId: 'demo-business-1',
    platform: 'instagram',
    accountId: 'demo-ig-456',
    accountName: '@hawagroup',
    username: 'hawagroup',
    profileImage: 'https://via.placeholder.com/150/E1306C/FFFFFF?text=IG',
    followers: 8920,
    status: 'connected',
    lastSyncAt: new Date(Date.now() - 1800000),
    lastSuccessfulPostAt: new Date(Date.now() - 43200000),
    createdAt: new Date(Date.now() - 2592000000),
    updatedAt: new Date(),
  },
  {
    id: 'demo-tiktok-1',
    businessId: 'demo-business-1',
    platform: 'tiktok',
    accountId: 'demo-tt-789',
    accountName: '@hawagroup',
    username: 'hawagroup',
    profileImage: 'https://via.placeholder.com/150/000000/FFFFFF?text=TT',
    followers: 15600,
    status: 'connected',
    lastSyncAt: new Date(Date.now() - 7200000),
    lastSuccessfulPostAt: new Date(Date.now() - 172800000),
    createdAt: new Date(Date.now() - 2592000000),
    updatedAt: new Date(),
  },
];

// Generate demo analytics data for the last 30 days
export function generateDemoAnalytics(businessId: string, platform: string, days: number = 30): AnalyticsSnapshot[] {
  const snapshots: AnalyticsSnapshot[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const baseFollowers = platform === 'facebook' ? 12450 : platform === 'instagram' ? 8920 : 15600;
    const dailyGrowth = Math.floor(Math.random() * 50) - 10;
    const followers = baseFollowers + (days - i) * dailyGrowth;

    snapshots.push({
      id: `demo-analytics-${platform}-${i}`,
      businessId,
      platform: platform as any,
      accountId: `demo-${platform}-1`,
      date,
      metrics: {
        followers,
        reach: Math.floor(followers * (2 + Math.random() * 3)),
        impressions: Math.floor(followers * (5 + Math.random() * 5)),
        views: platform === 'tiktok' ? Math.floor(followers * (10 + Math.random() * 10)) : undefined,
        likes: Math.floor(followers * (0.05 + Math.random() * 0.1)),
        comments: Math.floor(followers * (0.01 + Math.random() * 0.02)),
        shares: Math.floor(followers * (0.005 + Math.random() * 0.01)),
        saves: platform === 'instagram' ? Math.floor(followers * (0.01 + Math.random() * 0.02)) : undefined,
        reactions: platform === 'facebook' ? Math.floor(followers * (0.03 + Math.random() * 0.05)) : undefined,
        profileVisits: Math.floor(followers * (0.02 + Math.random() * 0.03)),
        websiteClicks: Math.floor(followers * (0.01 + Math.random() * 0.02)),
        engagement: Math.floor(followers * (0.1 + Math.random() * 0.2)),
        engagementRate: 1 + Math.random() * 3,
        followersGained: Math.max(0, dailyGrowth),
        followersLost: Math.max(0, -dailyGrowth),
      },
      createdAt: new Date(),
    });
  }

  return snapshots;
}

// Demo post analytics
export function generateDemoPostAnalytics(postId: string, platform: string): PostAnalytics[] {
  const now = new Date();
  const publishedAt = new Date(now.getTime() - 86400000); // 1 day ago

  return [
    {
      id: `demo-post-analytics-${postId}`,
      postId,
      postVariantId: `demo-variant-${postId}`,
      platform: platform as any,
      platformPostId: `demo-platform-post-${postId}`,
      date: publishedAt,
      metrics: {
        reach: Math.floor(1000 + Math.random() * 5000),
        impressions: Math.floor(2000 + Math.random() * 10000),
        views: platform === 'tiktok' ? Math.floor(5000 + Math.random() * 20000) : undefined,
        likes: Math.floor(100 + Math.random() * 500),
        comments: Math.floor(10 + Math.random() * 50),
        shares: Math.floor(5 + Math.random() * 30),
        saves: platform === 'instagram' ? Math.floor(20 + Math.random() * 100) : undefined,
        reactions: platform === 'facebook' ? Math.floor(50 + Math.random() * 200) : undefined,
        engagement: Math.floor(150 + Math.random() * 750),
        engagementRate: 2 + Math.random() * 5,
      },
      createdAt: publishedAt,
      updatedAt: new Date(),
    },
  ];
}

// Demo posts
export const demoPosts = [
  {
    id: 'demo-post-1',
    businessId: 'demo-business-1',
    createdBy: 'demo-user-1',
    caption: 'Excited to announce our new product launch! 🚀 #HawaGroup #NewProduct',
    hashtags: ['#HawaGroup', '#NewProduct', '#Launch'],
    mentions: [],
    media: [
      {
        id: 'demo-media-1',
        type: 'image',
        url: 'https://via.placeholder.com/800x600/0066CC/FFFFFF?text=Product+Launch',
        thumbnailUrl: 'https://via.placeholder.com/200x150/0066CC/FFFFFF?text=Product',
        width: 800,
        height: 600,
        size: 250000,
        format: 'jpg',
        order: 0,
      },
    ],
    platforms: ['facebook', 'instagram', 'tiktok'] as any[],
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(),
  },
  {
    id: 'demo-post-2',
    businessId: 'demo-business-1',
    createdBy: 'demo-user-1',
    caption: 'Thank you to our amazing community! We reached 10K followers! 🎉 #Milestone #ThankYou',
    hashtags: ['#Milestone', '#ThankYou', '#Community'],
    mentions: [],
    media: [
      {
        id: 'demo-media-2',
        type: 'image',
        url: 'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=10K+Followers',
        thumbnailUrl: 'https://via.placeholder.com/200x150/FF6B6B/FFFFFF?text=10K',
        width: 800,
        height: 600,
        size: 300000,
        format: 'jpg',
        order: 0,
      },
    ],
    platforms: ['facebook', 'instagram'] as any[],
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 172800000),
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(),
  },
  {
    id: 'demo-post-3',
    businessId: 'demo-business-1',
    createdBy: 'demo-user-1',
    caption: 'Behind the scenes at our office! #OfficeLife #TeamWork',
    hashtags: ['#OfficeLife', '#TeamWork', '#BehindTheScenes'],
    mentions: [],
    media: [
      {
        id: 'demo-media-3',
        type: 'video',
        url: 'https://via.placeholder.com/800x600/000000/FFFFFF?text=Video',
        thumbnailUrl: 'https://via.placeholder.com/200x150/000000/FFFFFF?text=Video',
        width: 800,
        height: 600,
        duration: 60,
        size: 5000000,
        format: 'mp4',
        order: 0,
      },
    ],
    platforms: ['tiktok'] as any[],
    status: 'published' as const,
    publishedAt: new Date(Date.now() - 259200000),
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(),
  },
];

// Demo business
export const demoBusiness = {
  id: 'demo-business-1',
  name: 'Hawa Group Demo',
  category: 'Retail',
  phone: '+960 123 4567',
  email: 'demo@hawagroup.com',
  website: 'https://hawagroup.com',
  description: 'Demo business for testing Hawa Social Hub',
  country: 'Maldives',
  timezone: 'Indian/Maldives',
  ownerId: 'demo-user-1',
  createdAt: new Date(Date.now() - 2592000000),
  updatedAt: new Date(),
};

// Demo user
export const demoUser = {
  id: 'demo-user-1',
  email: 'demo@hawasocialhub.com',
  fullName: 'Demo User',
  profileImage: 'https://via.placeholder.com/150/0066CC/FFFFFF?text=DU',
  emailVerified: true,
  createdAt: new Date(Date.now() - 2592000000),
  lastLoginAt: new Date(),
};

// Demo service
export const demoService = {
  async connectAccount(platform: string): Promise<SocialAccount> {
    // Simulate OAuth connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const account: SocialAccount = {
      id: `demo-${platform}-${Date.now()}`,
      businessId: 'demo-business-1',
      platform: platform as any,
      accountId: `demo-${platform}-${Math.random().toString(36).substr(2, 9)}`,
      accountName: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
      username: `demo${platform}`,
      profileImage: `https://via.placeholder.com/150/0066CC/FFFFFF?text=${platform.toUpperCase().charAt(0)}`,
      followers: Math.floor(1000 + Math.random() * 10000),
      status: 'connected',
      lastSyncAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return account;
  },

  async disconnectAccount(accountId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async publishPost(platform: string, content: any): Promise<{ success: boolean; postId?: string; error?: string }> {
    // Simulate publishing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: `Demo: Simulated publishing error for ${platform}`,
      };
    }

    return {
      success: true,
      postId: `demo-${platform}-post-${Date.now()}`,
    };
  },

  async getAnalytics(businessId: string, platform: string, days: number): Promise<AnalyticsSnapshot[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateDemoAnalytics(businessId, platform, days);
  },

  async syncAccount(accountId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
};
