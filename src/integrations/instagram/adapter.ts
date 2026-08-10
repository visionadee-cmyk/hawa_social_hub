import type { SocialPlatformAdapter, PublishData, PublishResult, PostStatus } from '../base';
import type { SocialAccount, PlatformMetrics, MediaItem } from '../../types';
import { isDemoMode, config } from '../../config';
import { demoService } from '../../services/demo';
import { getFirebaseFirestore } from '../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export class InstagramAdapter implements SocialPlatformAdapter {
  platform = 'instagram';

  async connect(): Promise<SocialAccount> {
    if (isDemoMode) {
      return demoService.connectAccount('instagram');
    }

    // Production: Initiate Instagram OAuth flow using Facebook Login
    // Instagram Business accounts use Facebook Login, not Instagram Basic Display API
    const redirectUri = `${window.location.origin}/auth/callback/instagram`;
    const scope = 'pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_engagement,instagram_basic,instagram_manage_insights,instagram_manage_comments,instagram_content_publish';
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state for verification
    sessionStorage.setItem('instagram_oauth_state', state);
    
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

    // Production: Delete the account from Firestore
    const db = getFirebaseFirestore();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    try {
      await deleteDoc(doc(db, 'socialAccounts', accountId));
    } catch (error) {
      console.error('Failed to delete Instagram account from Firestore:', error);
      throw new Error('Failed to disconnect Instagram account');
    }
  }

  async refreshToken(accountId: string): Promise<void> {
    if (isDemoMode) {
      return;
    }

    // Production: Refresh Instagram access token
    throw new Error('Instagram token refresh not implemented in production mode yet');
  }

  async getProfile(accountId: string): Promise<SocialAccount> {
    if (isDemoMode) {
      const account = (await import('../../services/demo')).demoSocialAccounts.find(
        a => a.platform === 'instagram' && a.accountId === accountId
      );
      if (!account) throw new Error('Demo Instagram account not found');
      return account;
    }

    // Production: Fetch Instagram business account details using Graph API
    throw new Error('Instagram profile fetch not implemented in production mode yet');
  }

  async checkConnectionStatus(accountId: string): Promise<boolean> {
    if (isDemoMode) {
      return true;
    }

    // Production: Check if Instagram access token is valid
    throw new Error('Instagram connection check not implemented in production mode yet');
  }

  async publish(accountId: string, data: PublishData): Promise<PublishResult> {
    if (isDemoMode) {
      return demoService.publishPost('instagram', data);
    }

    // Production: Publish to Instagram using Graph API
    // Note: This method doesn't have accessToken in the interface
    const { caption, media } = data;

    try {
      return {
        success: false,
        error: 'Instagram publishing requires accessToken which is not available in PublishData interface',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Instagram publishing failed',
        errorDetails: error,
      };
    }
  }

  async publishPost(data: { caption: string; media: MediaItem[]; accessToken: string; pageId: string }): Promise<{ platformPostId: string; status: string }> {
    const { caption, media, accessToken, pageId } = data;

    if (media && media.length > 0) {
      // Instagram publishing requires a multi-step process:
      // 1. Create media container (POST /{ig-user-id}/media)
      // 2. Publish the container (POST /{ig-container-id}/publish)

      const firstMedia = media[0];

      // Step 1: Create media container
      const containerResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            image_url: firstMedia.url,
            caption: caption || '',
          }),
        }
      );

      if (!containerResponse.ok) {
        const error = await containerResponse.json();
        throw new Error(`Instagram media container creation failed: ${error.error?.message || 'Unknown error'}`);
      }

      const containerResult = await containerResponse.json();
      const containerId = containerResult.id;

      // Step 2: Publish the container
      const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            creation_id: containerId,
          }),
        }
      );

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        throw new Error(`Instagram publishing failed: ${error.error?.message || 'Unknown error'}`);
      }

      const publishResult = await publishResponse.json();
      return {
        platformPostId: publishResult.id,
        status: 'published',
      };
    } else {
      throw new Error('Instagram requires at least one media item');
    }
  }

  async getPostStatus(accountId: string, platformPostId: string): Promise<PostStatus> {
    if (isDemoMode) {
      return {
        status: 'published',
        publishedAt: new Date(),
      };
    }

    // Production: Check post status using Graph API
    throw new Error('Instagram post status check not implemented in production mode yet');
  }

  async deletePost(accountId: string, platformPostId: string): Promise<void> {
    if (isDemoMode) {
      return;
    }

    // Production: Delete media using Graph API
    // DELETE /{ig-comment-id} or /{ig-media-id}
    throw new Error('Instagram post deletion not implemented in production mode yet');
  }

  async getAnalytics(accountId: string, startDate: Date, endDate: Date): Promise<PlatformMetrics> {
    if (isDemoMode) {
      const snapshots = await demoService.getAnalytics('demo-business-1', 'instagram', 30);
      const latest = snapshots[snapshots.length - 1];
      return latest.metrics;
    }

    // Production: Fetch Instagram Insights using Graph API
    // GET /{ig-user-id}/insights
    throw new Error('Instagram analytics not implemented in production mode yet');
  }

  async syncAnalytics(accountId: string): Promise<void> {
    if (isDemoMode) {
      return demoService.syncAccount(accountId);
    }

    // Production: Sync analytics data to Firestore
    throw new Error('Instagram analytics sync not implemented in production mode yet');
  }
}

export const instagramAdapter = new InstagramAdapter();
