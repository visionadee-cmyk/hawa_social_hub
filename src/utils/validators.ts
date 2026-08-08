export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  return { valid: true };
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const maxSize = 500 * 1024 * 1024; // 500MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload MP4, WebM, or MOV.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 500MB' };
  }

  return { valid: true };
}

export function validateCaption(caption: string, maxLength: number = 2200): { valid: boolean; error?: string } {
  if (caption.length > maxLength) {
    return { valid: false, error: `Caption must be less than ${maxLength} characters` };
  }

  return { valid: true };
}

export function validateHashtags(hashtags: string[], maxCount: number = 30): { valid: boolean; error?: string } {
  if (hashtags.length > maxCount) {
    return { valid: false, error: `Maximum ${maxCount} hashtags allowed` };
  }

  const invalidHashtag = hashtags.find(tag => !/^#\w+$/.test(tag));
  if (invalidHashtag) {
    return { valid: false, error: `Invalid hashtag format: ${invalidHashtag}` };
  }

  return { valid: true };
}

export function validateScheduledDate(date: Date): { valid: boolean; error?: string } {
  const now = new Date();
  const minDate = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now

  if (date < minDate) {
    return { valid: false, error: 'Scheduled time must be at least 15 minutes in the future' };
  }

  return { valid: true };
}

export function validateBusinessName(name: string): { valid: boolean; error?: string } {
  if (name.length < 2) {
    return { valid: false, error: 'Business name must be at least 2 characters' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'Business name must be less than 100 characters' };
  }

  return { valid: true };
}

export function validateRequired(value: any): { valid: boolean; error?: string } {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: 'This field is required' };
  }

  return { valid: true };
}
