// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  profileImage?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Business Types
export interface Business {
  id: string;
  name: string;
  logo?: string;
  category: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  country: string;
  timezone: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Team Member Types
export interface TeamMember {
  id: string;
  businessId: string;
  userId: string;
  role: 'super_admin' | 'business_owner' | 'social_media_manager' | 'editor' | 'viewer';
  permissions: Permission[];
  status: 'active' | 'invited' | 'disabled';
  invitedAt?: Date;
  joinedAt?: Date;
  createdAt: Date;
}

export type Permission =
  | 'dashboard.view'
  | 'posts.create'
  | 'posts.edit'
  | 'posts.delete'
  | 'posts.publish'
  | 'posts.schedule'
  | 'analytics.view'
  | 'campaigns.manage'
  | 'media.manage'
  | 'accounts.manage'
  | 'team.manage'
  | 'settings.manage'
  | 'reports.view'
  | 'approvals.manage';

// Social Platform Types
export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok';

export interface SocialAccount {
  id: string;
  businessId: string;
  platform: SocialPlatform;
  accountId: string;
  accountName: string;
  username?: string;
  profileImage?: string;
  followers?: number;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  status: 'connected' | 'disconnected' | 'expired' | 'error';
  lastSyncAt?: Date;
  lastSuccessfulPostAt?: Date;
  connectionError?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Post Types
export interface Post {
  id: string;
  businessId: string;
  createdBy: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  media: MediaItem[];
  platforms: SocialPlatform[];
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'partially_published' | 'failed' | 'cancelled';
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  campaignId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
}

export interface PostVariant {
  id: string;
  postId: string;
  platform: SocialPlatform;
  caption?: string;
  hashtags?: string[];
  media?: MediaItem[];
  platformSpecificSettings?: Record<string, any>;
  publishingJobId?: string;
  status: 'pending' | 'publishing' | 'published' | 'failed';
  platformPostId?: string;
  platformPostUrl?: string;
  error?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  cloudinaryPublicId?: string;
  width?: number;
  height?: number;
  duration?: number;
  size: number;
  format: string;
  alt?: string;
  caption?: string;
  order: number;
}

// Publishing Job Types
export interface PublishingJob {
  id: string;
  postId: string;
  postVariantId: string;
  businessId: string;
  platform: SocialPlatform;
  accountId: string;
  media: MediaItem[];
  caption: string;
  scheduledAt?: Date;
  status: 'queued' | 'publishing' | 'published' | 'failed' | 'cancelled';
  attempts: number;
  error?: string;
  createdAt: Date;
  publishedAt?: Date;
}

export interface PublishingLog {
  id: string;
  jobId: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
}

// Analytics Types
export interface AnalyticsSnapshot {
  id: string;
  businessId: string;
  platform: SocialPlatform;
  accountId: string;
  date: Date;
  metrics: PlatformMetrics;
  createdAt: Date;
}

export interface PostAnalytics {
  id: string;
  postId: string;
  postVariantId: string;
  platform: SocialPlatform;
  platformPostId?: string;
  date: Date;
  metrics: PostMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformMetrics {
  followers?: number;
  reach?: number;
  impressions?: number;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  reactions?: number;
  profileVisits?: number;
  websiteClicks?: number;
  engagement?: number;
  engagementRate?: number;
  followersGained?: number;
  followersLost?: number;
}

export interface PostMetrics {
  reach?: number;
  impressions?: number;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  reactions?: number;
  engagement?: number;
  engagementRate?: number;
}

// Media Library Types
export interface MediaLibraryItem {
  id: string;
  businessId: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  cloudinaryPublicId: string;
  width?: number;
  height?: number;
  duration?: number;
  size: number;
  format: string;
  alt?: string;
  caption?: string;
  folder?: string;
  tags: string[];
  isFavorite: boolean;
  uploadedBy: string;
  uploadedAt: Date;
}

// Brand Kit Types
export interface BrandKit {
  id: string;
  businessId: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  businessName: string;
  website?: string;
  phone?: string;
  email?: string;
  defaultHashtags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Template Types
export interface Template {
  id: string;
  businessId: string;
  name: string;
  category: string;
  description?: string;
  caption: string;
  hashtags: string[];
  mediaTemplates: MediaTemplate[];
  platform: SocialPlatform | 'all';
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaTemplate {
  type: 'image' | 'video';
  placeholder?: string;
  dimensions?: { width: number; height: number };
  textOverlays?: TextOverlay[];
}

export interface TextOverlay {
  text: string;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight?: string;
  };
}

// Campaign Types
export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  platforms: SocialPlatform[];
  status: 'draft' | 'active' | 'completed' | 'paused';
  postIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Content Idea Types
export interface ContentIdea {
  id: string;
  businessId: string;
  title: string;
  description?: string;
  platform?: SocialPlatform;
  category?: string;
  notes?: string;
  media?: MediaItem[];
  status: 'idea' | 'draft' | 'scheduled' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  businessId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export type NotificationType =
  | 'post_published'
  | 'post_failed'
  | 'post_scheduled'
  | 'approval_required'
  | 'approval_accepted'
  | 'approval_rejected'
  | 'account_disconnected'
  | 'authorization_expiring'
  | 'analytics_sync_failed'
  | 'team_invitation'
  | 'report_generated';

// Activity Log Types
export interface ActivityLog {
  id: string;
  businessId: string;
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  platform?: SocialPlatform;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Settings Types
export interface BusinessSettings {
  id: string;
  businessId: string;
  timezone: string;
  language: 'en' | 'dv';
  currency: string;
  autoApprovePosts: boolean;
  requireApprovalForPublish: boolean;
  monthlyReportEnabled: boolean;
  monthlyReportRecipients: string[];
  notificationPreferences: NotificationPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  postPublished: boolean;
  postFailed: boolean;
  postScheduled: boolean;
  approvalRequired: boolean;
  accountDisconnected: boolean;
  analyticsSyncFailed: boolean;
}

// Report Types
export interface Report {
  id: string;
  businessId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate: Date;
  generatedBy: string;
  status: 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  format: 'pdf' | 'csv' | 'excel';
  data?: ReportData;
  createdAt: Date;
  completedAt?: Date;
}

export interface ReportData {
  summary: {
    totalPosts: number;
    totalFollowers: number;
    followerGrowth: number;
    totalReach: number;
    totalImpressions: number;
    totalEngagement: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalViews: number;
  };
  platformComparison: Record<SocialPlatform, PlatformMetrics>;
  bestPosts: Array<{
    postId: string;
    platform: SocialPlatform;
    engagement: number;
    reach: number;
    likes: number;
  }>;
  recommendations: string[];
}

// App Mode Types
export type AppMode = 'demo' | 'development' | 'production';

export interface AppConfig {
  mode: AppMode;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset: string;
  };
  meta: {
    appId: string;
    appSecret: string;
  };
  tiktok: {
    clientKey: string;
    clientSecret: string;
  };
  ai?: {
    apiKey: string;
    provider: 'openai' | 'anthropic';
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface BusinessFormData {
  name: string;
  category: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  country: string;
  timezone: string;
}

export interface CreatePostFormData {
  caption: string;
  hashtags: string[];
  mentions: string[];
  media: MediaItem[];
  platforms: SocialPlatform[];
  scheduledAt?: Date;
  platformSpecificContent?: Record<SocialPlatform, { caption?: string; hashtags?: string[] }>;
}

// UI Types
export interface DateRange {
  start: Date;
  end: Date;
}

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_month'
  | 'last_month'
  | 'custom';

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface PlatformComparison {
  platform: SocialPlatform;
  metrics: PlatformMetrics;
}
