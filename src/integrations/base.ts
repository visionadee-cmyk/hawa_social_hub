import type { SocialAccount, PlatformMetrics, MediaItem } from '../types';

export interface SocialPlatformAdapter {
  platform: string;
  
  // OAuth
  connect(): Promise<SocialAccount>;
  disconnect(accountId: string): Promise<void>;
  refreshToken(accountId: string): Promise<void>;
  
  // Account
  getProfile(accountId: string): Promise<SocialAccount>;
  checkConnectionStatus(accountId: string): Promise<boolean>;
  
  // Publishing
  publish(accountId: string, data: PublishData): Promise<PublishResult>;
  getPostStatus(accountId: string, platformPostId: string): Promise<PostStatus>;
  deletePost(accountId: string, platformPostId: string): Promise<void>;
  
  // Analytics
  getAnalytics(accountId: string, startDate: Date, endDate: Date): Promise<PlatformMetrics>;
  syncAnalytics(accountId: string): Promise<void>;
}

export interface PublishData {
  caption: string;
  hashtags: string[];
  media: MediaItem[];
  scheduledAt?: Date;
  platformSpecificSettings?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  platformPostUrl?: string;
  error?: string;
  errorDetails?: any;
}

export interface PostStatus {
  status: 'published' | 'processing' | 'failed' | 'deleted';
  publishedAt?: Date;
  error?: string;
}
