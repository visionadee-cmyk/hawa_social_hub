import { facebookAdapter } from './facebook/adapter';
import { instagramAdapter } from './instagram/adapter';
import { tiktokAdapter } from './tiktok/adapter';
import type { SocialPlatformAdapter } from './base';
import type { SocialPlatform } from '../types';

export const platformAdapters: Record<SocialPlatform, SocialPlatformAdapter> = {
  facebook: facebookAdapter,
  instagram: instagramAdapter,
  tiktok: tiktokAdapter,
};

export function getPlatformAdapter(platform: SocialPlatform): SocialPlatformAdapter {
  return platformAdapters[platform];
}
