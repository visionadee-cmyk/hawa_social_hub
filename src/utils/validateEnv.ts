import { config, isDemoMode } from '../config';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateEnvironment = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (isDemoMode) {
    return {
      valid: true,
      errors: [],
      warnings: ['Running in Demo Mode - using simulated data'],
    };
  }

  // Validate Firebase configuration
  if (!config.firebase.apiKey) {
    errors.push('VITE_FIREBASE_API_KEY is required in production mode');
  }
  if (!config.firebase.projectId) {
    errors.push('VITE_FIREBASE_PROJECT_ID is required in production mode');
  }
  if (!config.firebase.appId) {
    errors.push('VITE_FIREBASE_APP_ID is required in production mode');
  }

  // Validate Meta configuration
  if (!config.meta.appId) {
    warnings.push('VITE_META_APP_ID is not set - Facebook/Instagram integration will not work');
  }
  if (!config.meta.appSecret) {
    warnings.push('VITE_META_APP_SECRET is not set - Facebook/Instagram integration will not work');
  }

  // Validate TikTok configuration
  if (!config.tikTok.clientKey) {
    warnings.push('VITE_TIKTOK_CLIENT_KEY is not set - TikTok integration will not work');
  }
  if (!config.tikTok.clientSecret) {
    warnings.push('VITE_TIKTOK_CLIENT_SECRET is not set - TikTok integration will not work');
  }

  // Validate Cloudinary configuration
  if (!config.cloudinary.cloudName) {
    warnings.push('VITE_CLOUDINARY_CLOUD_NAME is not set - Media upload will use local storage');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const logEnvironmentValidation = () => {
  const validation = validateEnvironment();

  if (validation.valid) {
    console.log('✅ Environment configuration is valid');
  } else {
    console.error('❌ Environment configuration has errors:');
    validation.errors.forEach((error) => console.error(`  - ${error}`));
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️ Environment configuration warnings:');
    validation.warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  return validation;
};
