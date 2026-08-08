# Hawa Social Hub - Production Setup Guide

This guide will help you connect your real social media accounts to Hawa Social Hub.

## Your Social Media Accounts
- **Facebook**: https://www.facebook.com/profile.php?id=61591869200851
- **Instagram**: https://www.instagram.com/hawadailymv/
- **TikTok**: https://www.tiktok.com/@hawadailymv

## Prerequisites
- A Google account (for Firebase and Google Sign-in)
- A Meta account (for Facebook/Instagram)
- A TikTok account (for TikTok API)

---

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Project name: `hawa-social-hub`
4. Enable Google Analytics (optional, recommended for production)
5. Click "Create project"

### 1.2 Enable Authentication
1. In Firebase Console, go to **Build → Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password**:
   - Click Email/Password
   - Toggle "Enable" to ON
   - Click "Save"
5. Enable **Google**:
   - Click Google
   - Toggle "Enable" to ON
   - Add your support email
   - Click "Save"

### 1.3 Create Firestore Database
1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Choose a location: Select a location close to your users (e.g., `asia-south1` for Maldives)
4. Choose **Start in production mode**
5. Click **Enable**

### 1.4 Deploy Security Rules
1. Go to **Build → Firestore Database → Rules**
2. Click the "Publish" button
3. Copy the content from `firestore.rules` in your project
4. Paste it into the rules editor
5. Click "Publish"

### 1.5 Deploy Indexes
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Firestore"
   - Select "Use an existing project"
   - Select "hawa-social-hub"
   - Select "What file should be used for Firestore Rules?" → `firestore.rules`
   - Select "What file should be used for Firestore indexes?" → `firestore.indexes.json`
4. Deploy indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### 1.6 Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **</>** (web) icon
4. App nickname: `hawa-social-hub`
5. Click "Register app"
6. Copy the configuration values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

---

## Step 2: Meta Developer Setup (Facebook/Instagram)

### 2.1 Create Meta Developer Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "Get Started"
3. Complete the verification process
4. Accept the terms

### 2.2 Create Meta App
1. Click "Create App"
2. Select **Business** app type
3. App name: `Hawa Social Hub`
4. App contact email: your email
5. Click "Create App"

### 2.3 Add Facebook Login Product
1. In your app dashboard, click **Add Product**
2. Select **Facebook Login**
3. Click "Set Up"
4. Go to **Settings → Basic**
5. Add your redirect URLs:
   - Development: `http://localhost:5175/auth/callback/facebook`
   - Production: `https://your-domain.com/auth/callback/facebook`
6. Save changes

### 2.4 Add Instagram Basic Display
1. In your app dashboard, click **Add Product**
2. Select **Instagram Basic Display**
3. Click "Set Up"
4. Go to **Instagram Basic Display → Settings**
5. Add your redirect URLs:
   - Development: `http://localhost:5175/auth/callback/instagram`
   - Production: `https://your-domain.com/auth/callback/instagram`
6. Add **Valid OAuth Redirect URIs**:
   - `http://localhost:5175/auth/callback/instagram`
7. Save changes

### 2.5 Get Meta Credentials
1. Go to **Settings → Basic**
2. Copy:
   - **App ID**
   - **App Secret** (click "Show" to reveal)

---

## Step 3: TikTok Developer Setup

### 3.1 Create TikTok Developer Account
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Click "Sign Up"
3. Complete the registration
4. Verify your email

### 3.2 Create TikTok App
1. Go to [TikTok Developer Dashboard](https://developer.tiktok.com/dashboard)
2. Click "Create App"
3. App name: `Hawa Social Hub`
4. App category: **Business Tools**
5. App description: Social media management platform
6. Click "Create"

### 3.3 Configure OAuth
1. Go to **Apps → Your App → Settings**
2. Find **OAuth Settings**
3. Add redirect URLs:
   - Development: `http://localhost:5175/auth/callback/tiktok`
   - Production: `https://your-domain.com/auth/callback/tiktok`
4. Save changes

### 3.4 Get TikTok Credentials
1. Go to **Apps → Your App → Keys & Tokens**
2. Copy:
   - **Client Key**
   - **Client Secret**

---

## Step 4: Cloudinary Setup (Optional, for Media Storage)

### 4.1 Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign up for free"
3. Complete registration

### 4.2 Get Cloudinary Credentials
1. Go to **Dashboard**
2. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "Show" to reveal)

---

## Step 5: Update .env File

Replace the placeholder values in your `.env` file with the actual credentials:

```env
# App Mode
VITE_APP_MODE=development

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Meta Configuration (Facebook/Instagram)
VITE_META_APP_ID=your_meta_app_id
VITE_META_APP_SECRET=your_meta_app_secret

# TikTok Configuration
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# AI Configuration (Optional)
VITE_AI_API_KEY=
VITE_AI_PROVIDER=openai

# Default Settings
VITE_DEFAULT_TIMEZONE=Indian/Maldives
VITE_DEFAULT_LANGUAGE=en
VITE_DEFAULT_CURRENCY=MVR
```

---

## Step 6: Restart Development Server

1. Stop the current dev server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```

---

## Step 7: Test the Application

1. Open `http://localhost:5175` in your browser
2. You should see the login page
3. Register a new account or sign in with Google
4. Complete the onboarding flow
5. Connect your social media accounts:
   - Go to Social Accounts page
   - Click "Connect Facebook"
   - Click "Connect Instagram"
   - Click "Connect TikTok"
6. Test creating a post

---

## Important Notes

### Security
- **Never commit your `.env` file to Git**
- Add `.env` to your `.gitignore` file
- Use different credentials for development and production

### OAuth Redirect URLs
- For local development: `http://localhost:5175/auth/callback/{platform}`
- For production: `https://your-domain.com/auth/callback/{platform}`
- Make sure to add both to your app settings

### Rate Limits
- Facebook/Instagram: 200 calls per hour per user
- TikTok: 1000 calls per day per app
- Firebase: 50,000 reads/day (Spark plan)

### Testing
- Test in development mode first
- Verify all OAuth flows work
- Test post creation and publishing
- Check analytics data sync

---

## Troubleshooting

### Firebase Authentication Errors
- Ensure Firebase Auth is enabled
- Check that your API key is correct
- Verify your domain is authorized in Firebase Console

### OAuth Redirect Errors
- Verify redirect URLs match exactly
- Check that your app is in "Live" mode (not "Development")
- Ensure HTTPS is used in production

### Firestore Permission Errors
- Verify security rules are deployed
- Check that indexes are created
- Ensure user is authenticated

---

## Next Steps

After successful setup:
1. Deploy to production (Vercel, Netlify, or Firebase Hosting)
2. Set up custom domain
3. Configure production OAuth redirect URLs
4. Enable Firebase Analytics
5. Set up error monitoring (Sentry)
6. Configure CI/CD pipeline

---

## Support

If you encounter issues:
- Check Firebase Console for error logs
- Review Meta Developer Dashboard for API status
- Check TikTok Developer Dashboard for API status
- Review browser console for client-side errors
- Check server logs for backend errors
