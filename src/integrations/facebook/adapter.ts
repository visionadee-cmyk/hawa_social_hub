import type { SocialPlatformAdapter, PublishData, PublishResult, PostStatus } from '../base';
import type { SocialAccount, PlatformMetrics, MediaItem } from '../../types';
import { isDemoMode, config } from '../../config';
import { demoService } from '../../services/demo';

export class FacebookAdapter implements SocialPlatformAdapter {
  platform = 'facebook';

  async connect(): Promise<SocialAccount> {
    if (isDemoMode) {
      return demoService.connectAccount('facebook');
    }

    // Production: Initiate Facebook OAuth flow
    const redirectUri = `${window.location.origin}/auth/callback/facebook`;
    const scope = 'pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish';
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state for verification
    sessionStorage.setItem('facebook_oauth_state', state);
    
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
    authUrl.searchParams.append('client_id', config.meta.appId);
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

    // Production: Revoke Facebook access token
    throw new Error('Facebook disconnect not implemented in production mode yet');
  }

  async refreshToken(accountId: string): Promise<void> {
    if (isDemoMode) {
      return;
    }

    // Production: Refresh Facebook access token using long-lived token endpoint
    throw new Error('Facebook token refresh not implemented in production mode yet');
  }

  async getProfile(accountId: string): Promise<SocialAccount> {
    if (isDemoMode) {
      const account = (await import('../../services/demo')).demoSocialAccounts.find(
        a => a.platform === 'facebook' && a.accountId === accountId
      );
      if (!account) throw new Error('Demo Facebook account not found');
      return account;
    }

    // Production: Fetch Facebook page details using Graph API
    throw new Error('Facebook profile fetch not implemented in production mode yet');
  }

  async checkConnectionStatus(accountId: string): Promise<boolean> {
    if (isDemoMode) {
      return true;
    }

    // Production: Check if Facebook access token is valid
    throw new Error('Facebook connection check not implemented in production mode yet');
  }

  async publish(accountId: string, data: PublishData): Promise<PublishResult> {
    if (isDemoMode) {
      return demoService.publishPost('facebook', data);
    }

    // Production: Publish to Facebook using Graph API
    // POST /{page-id}/feed or /{page-id}/photos for media
    throw new Error('Facebook publishing not implemented in production mode yet');
  }

  async getPostStatus(accountId: string, platformPostId: string): Promise<PostStatus> {
    if (isDemoMode) {
      return {
        status: 'published',
        publishedAt: new Date(),
      };
    }

    // Production: Check post status using Graph API
    throw new Error('Facebook post status check not implemented in production mode yet');
  }

  async deletePost(accountId: string, platformPostId: string): Promise<void> {
    if (isDemoMode) {
      return;
    }

    // Production: Delete post using Graph API
    // DELETE /{post-id}
    throw new Error('Facebook post deletion not implemented in production mode yet');
  }

  async getAnalytics(accountId: string, startDate: Date, endDate: Date): Promise<PlatformMetrics> {
    if (isDemoMode) {
      const snapshots = await demoService.getAnalytics('demo-business-1', 'facebook', 30);
      const latest = snapshots[snapshots.length - 1];
      return latest.metrics;
    }

    // Production: Fetch Facebook Page Insights using Graph API
    // GET /{page-id}/insights
    throw new Error('Facebook analytics not implemented in production mode yet');
  }

  async syncAnalytics(accountId: string): Promise<void> {
    if (isDemoMode) {
      return demoService.syncAccount(accountId);
    }

    // Production: Sync analytics data to Firestore
    throw new Error('Facebook analytics sync not implemented in production mode yet');
  }
}

export const facebookAdapter = new FacebookAdapter();
