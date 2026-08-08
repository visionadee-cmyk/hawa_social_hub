# How to Connect Social Media Accounts - Step by Step

This guide shows you exactly how to connect each social media platform to Hawa Social Hub.

---

## STEP 1: Connect Facebook

### 1.1 Create Meta Developer Account
1. Go to: https://developers.facebook.com/
2. Click "Get Started"
3. Sign up or log in with your Facebook account
4. Complete the verification (add phone number if needed)
5. Accept the terms

### 1.2 Create a Meta App
1. Click "Create App" button
2. Select **"Business"** as app type
3. App Name: `Hawa Social Hub`
4. App Contact Email: your email address
5. Click "Create App"

### 1.3 Add Facebook Login
1. In your app dashboard, find "Add Product" section
2. Click **"Facebook Login"**
3. Click "Set Up"
4. Go to **Settings → Basic**
5. Find "Redirect OAuth Redirect URIs"
6. Add this URL: `http://localhost:5175/auth/callback/facebook`
7. Click "Save Changes"

### 1.4 Get Your Facebook Credentials
1. Stay on **Settings → Basic** page
2. Copy **App ID** (this is your `VITE_META_APP_ID`)
3. Click "Show" next to **App Secret** and copy it (this is your `VITE_META_APP_SECRET`)

### 1.5 Add to .env File
Open your `.env` file and add:
```env
VITE_META_APP_ID=your_copied_app_id
VITE_META_APP_SECRET=your_copied_app_secret
```

---

## STEP 2: Connect Instagram

### 2.1 Use the Same Meta App
Instagram uses the same Meta app you created for Facebook.

### 2.2 Add Instagram Basic Display
1. Go back to your app dashboard (https://developers.facebook.com/apps/)
2. Click on your "Hawa Social Hub" app
3. Click **"Add Product"**
4. Select **"Instagram Basic Display"**
5. Click "Set Up"

### 2.3 Configure Instagram OAuth
1. Go to **Instagram Basic Display → Settings**
2. Find "Valid OAuth Redirect URIs"
3. Add this URL: `http://localhost:5175/auth/callback/instagram`
4. Click "Save Changes"

### 2.4 Test Instagram Connection
1. In Instagram Basic Display, click "Test Token Generator"
2. Log in with your Instagram account
3. This will verify your app can access Instagram

**Note:** Instagram uses the same `VITE_META_APP_ID` and `VITE_META_APP_SECRET` from Facebook.

---

## STEP 3: Connect TikTok

### 3.1 Create TikTok Developer Account
1. Go to: https://developers.tiktok.com/
2. Click "Sign Up"
3. Sign up with your TikTok account or email
4. Verify your email address
5. Complete your profile

### 3.2 Create TikTok App
1. Go to: https://developer.tiktok.com/dashboard
2. Click "Create App"
3. App Name: `Hawa Social Hub`
4. App Category: Select **"Business Tools"**
5. App Description: Social media management platform for Hawa Daily
6. Click "Create"

### 3.3 Configure OAuth Settings
1. Go to **Apps → Your App → Settings**
2. Find **"OAuth Settings"**
3. Add this Redirect URL: `http://localhost:5175/auth/callback/tiktok`
4. Click "Save"

### 3.4 Get Your TikTok Credentials
1. Go to **Apps → Your App → Keys & Tokens**
2. Copy **Client Key** (this is your `VITE_TIKTOK_CLIENT_KEY`)
3. Click "Show" next to **Client Secret** and copy it (this is your `VITE_TIKTOK_CLIENT_SECRET`)

### 3.5 Add to .env File
Open your `.env` file and add:
```env
VITE_TIKTOK_CLIENT_KEY=your_copied_client_key
VITE_TIKTOK_CLIENT_SECRET=your_copied_client_secret
```

---

## STEP 4: Update Your .env File

Your complete `.env` file should look like this:

```env
# App Mode
VITE_APP_MODE=development

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Meta Configuration (Facebook/Instagram)
VITE_META_APP_ID=your_meta_app_id_here
VITE_META_APP_SECRET=your_meta_app_secret_here

# TikTok Configuration
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key_here
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret_here

# Cloudinary Configuration (Optional)
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_API_KEY=
VITE_CLOUDINARY_API_SECRET=

# AI Configuration (Optional)
VITE_AI_API_KEY=
VITE_AI_PROVIDER=openai

# Default Settings
VITE_DEFAULT_TIMEZONE=Indian/Maldives
VITE_DEFAULT_LANGUAGE=en
VITE_DEFAULT_CURRENCY=MVR
```

---

## STEP 5: Restart Your App

1. Stop the current dev server (press Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

---

## STEP 6: Connect Your Accounts in the App

1. Open http://localhost:5175 in your browser
2. Register or log in to your account
3. Complete the onboarding flow
4. Go to **Social Accounts** page
5. Click **"Connect Facebook"** - this will open Facebook OAuth
6. Authorize the app and select your Facebook page
7. Click **"Connect Instagram"** - this will open Instagram OAuth
8. Authorize the app with your Instagram account
9. Click **"Connect TikTok"** - this will open TikTok OAuth
10. Authorize the app with your TikTok account

---

## Your Specific Accounts

After connecting, you'll be able to manage:
- **Facebook Page**: https://www.facebook.com/profile.php?id=61591869200851
- **Instagram**: https://www.instagram.com/hawadailymv/
- **TikTok**: https://www.tiktok.com/@hawadailymv

---

## Troubleshooting

### Facebook Connection Issues
- Make sure your redirect URL is exactly: `http://localhost:5175/auth/callback/facebook`
- Check that your app is in "Development" mode (not "Live")
- Verify your App ID and App Secret are correct

### Instagram Connection Issues
- Make sure you added Instagram Basic Display product
- Check the redirect URL: `http://localhost:5175/auth/callback/instagram`
- Use the Test Token Generator to verify connection

### TikTok Connection Issues
- Make sure your app category is "Business Tools"
- Check the redirect URL: `http://localhost:5175/auth/callback/tiktok`
- Verify Client Key and Client Secret are correct

### General Issues
- Make sure you restarted the dev server after updating .env
- Check browser console for error messages
- Verify all environment variables are set correctly

---

## Need Help?

If you get stuck:
1. Check the browser console (F12) for error messages
2. Review the SETUP_GUIDE.md for detailed instructions
3. Check the Meta Developer Dashboard for app status
4. Check the TikTok Developer Dashboard for app status
