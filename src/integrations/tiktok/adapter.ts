import type { SocialPlatformAdapter, PublishData, PublishResult, PostStatus } from '../base';
import type { SocialAccount, PlatformMetrics } from '../../types';
import { isDemoMode, config } from '../../config';
import { demoService } from '../../services/demo';
import { getFirebaseFirestore } from '../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export class TikTokAdapter implements SocialPlatformAdapter {
  platform = 'tiktok';

  async connect(): Promise<SocialAccount> {
    if (isDemoMode) {
      return demoService.connectAccount('tiktok');
    }

    // Production: Initiate TikTok OAuth flow
    const redirectUri = `${window.location.origin}/auth/callback/tiktok`;
    const scope = 'user.info.basic,video.list,video.publish';
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state for verification
    sessionStorage.setItem('tiktok_oauth_state', state);
    
    const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
    authUrl.searchParams.append('client_key', config.tiktok.clientKey);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('response_type', 'code');
    
    window.location.href = authUrl.toString();
    
    // Return a promise that will never resolve (since we redirect)
    return new Promise(() => {});
  }

  async disconnect(accountId: string): Promise<void> {
    if (isDemoMode) {
      return demoService.disconnectAccount(accountId);
    }

    // Production: Delete the account from Firestore
    const db = getFirebaseFirestore();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    try {
      await deleteDoc(doc(db, 'socialAccounts', accountId));
    } catch (error) {
      console.error('Failed to delete TikTok account from Firestore:', error);
      throw new Error('Failed to disconnect TikTok account');
    }
  }

  async refreshToken(accountId: string): Promise<void> {
    if (isDemoMode) {
      return;
    }

    // Production: Refresh TikTok access token
    throw new Error('TikTok token refresh not implemented in production mode yet');
  }

  async getProfile(accountId: string): Promise<SocialAccount> {
    if (isDemoMode) {
      const account = (await import('../../services/demo')).demoSocialAccounts.find(
        a => a.platform === 'tiktok' && a.accountId === accountId
      );
      if (!account) throw new Error('Demo TikTok account not found');
      return account;
    }

    // Production: Fetch TikTok user details using TikTok API
    throw new Error('TikTok profile fetch not implemented in production mode yet');
  }

  async checkConnectionStatus(accountId: string): Promise<boolean> {
    if (isDemoMode) {
      return true;
    }

    // Production: Check if TikTok access token is valid
    throw new Error('TikTok connection check not implemented in production mode yet');
  }

  async publish(accountId: string, data: PublishData): Promise<PublishResult> {
    if (isDemoMode) {
      return demoService.publishPost('tiktok', data);
    }

    // Production: Publish to TikTok using TikTok API
    // POST /video/upload/ for videos
    throw new Error('TikTok publishing not implemented in production mode yet');
  }

  async getPostStatus(accountId: string, platformPostId: string): Promise<PostStatus> {
    if (isDemoMode) {
      return {
        status: 'published',
        publishedAt: new Date(),
      };
    }

    // Production: Check post status using TikTok API
    throw new Error('TikTok post status check not implemented in production mode yet');
  }

  async deletePost(accountId: string, platformPostId: string): Promise<void> {
    if (isDemoMode) {
      return;
    }

    // Production: Delete video using TikTok API
    throw new Error('TikTok post deletion not implemented in production mode yet');
  }

  async getAnalytics(accountId: string, startDate: Date, endDate: Date): Promise<PlatformMetrics> {
    if (isDemoMode) {
      const snapshots = await demoService.getAnalytics('demo-business-1', 'tiktok', 30);
      const latest = snapshots[snapshots.length - 1];
      return latest.metrics;
    }

    // Production: Fetch TikTok analytics using TikTok API
    throw new Error('TikTok analytics not implemented in production mode yet');
  }

  async syncAnalytics(accountId: string): Promise<void> {
    if (isDemoMode) {
      return demoService.syncAccount(accountId);
    }

    // Production: Sync analytics data to Firestore
    throw new Error('TikTok analytics sync not implemented in production mode yet');
  }
}

export const tiktokAdapter = new TikTokAdapter();
