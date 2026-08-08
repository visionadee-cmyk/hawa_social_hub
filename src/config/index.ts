import type { AppConfig, AppMode } from '../types';

const getFirebaseConfig = () => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };
};

const getCloudinaryConfig = () => {
  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
  };
};

const getMetaConfig = () => {
  return {
    appId: import.meta.env.VITE_META_APP_ID || '',
    appSecret: import.meta.env.VITE_META_APP_SECRET || '',
  };
};

const getTikTokConfig = () => {
  return {
    clientKey: import.meta.env.VITE_TIKTOK_CLIENT_KEY || '',
    clientSecret: import.meta.env.VITE_TIKTOK_CLIENT_SECRET || '',
  };
};

const getAIConfig = () => {
  return {
    apiKey: import.meta.env.VITE_AI_API_KEY || '',
    provider: (import.meta.env.VITE_AI_PROVIDER as 'openai' | 'anthropic') || 'openai',
  };
};

export const config: AppConfig = {
  mode: (import.meta.env.VITE_APP_MODE as AppMode) || 'demo',
  firebase: getFirebaseConfig(),
  cloudinary: getCloudinaryConfig(),
  meta: getMetaConfig(),
  tiktok: getTikTokConfig(),
  ai: getAIConfig(),
};

export const isDemoMode = config.mode === 'demo';
export const isDevelopmentMode = config.mode === 'development';
export const isProductionMode = config.mode === 'production';

export const defaultTimezone = import.meta.env.VITE_DEFAULT_TIMEZONE || 'Indian/Maldives';
export const defaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';
export const defaultCurrency = import.meta.env.VITE_DEFAULT_CURRENCY || 'MVR';
