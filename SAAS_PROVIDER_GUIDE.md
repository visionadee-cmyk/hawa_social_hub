# Hawa Social Hub - SaaS Provider Setup Guide

This guide is for you as the SaaS provider. Your customers will NOT need to create any developer accounts - you handle all the complexity.

---

## How It Works

**You (Provider):**
- Create ONE Meta Developer app
- Create ONE TikTok Developer app
- Create ONE Firebase project
- Add YOUR credentials to the app
- Deploy the app to production

**Your Customers:**
- Sign up/login to your app
- Click "Connect Facebook" → OAuth through YOUR app
- Click "Connect Instagram" → OAuth through YOUR app
- Click "Connect TikTok" → OAuth through YOUR app
- Done! Their accounts are connected

---

## Step 1: Create Your Meta Developer App (For All Users)

### 1.1 Create Meta Developer Account
1. Go to: https://developers.facebook.com/
2. Click "Get Started"
3. Sign up with your business Facebook account
4. Complete verification
5. Accept terms

### 1.2 Create ONE Meta App
1. Click "Create App"
2. Select **"Business"** app type
3. App Name: `Hawa Social Hub` (your brand name)
4. App Contact Email: your business email
5. Click "Create App"

### 1.3 Add Facebook Login Product
1. In app dashboard, click **"Add Product"**
2. Select **"Facebook Login"**
3. Click "Set Up"
4. Go to **Settings → Basic**
5. Add your production redirect URL: `https://your-domain.com/auth/callback/facebook`
6. For local testing, also add: `http://localhost:5175/auth/callback/facebook`
7. Click "Save"

### 1.4 Add Instagram Basic Display
1. Click **"Add Product"**
2. Select **"Instagram Basic Display"**
3. Click "Set Up"
4. Go to **Instagram Basic Display → Settings**
5. Add redirect URLs:
   - Production: `https://your-domain.com/auth/callback/instagram`
   - Local: `http://localhost:5175/auth/callback/instagram`
6. Click "Save"

### 1.5 Get Your Credentials
1. Stay on **Settings → Basic**
2. Copy **App ID**
3. Click "Show" next to **App Secret** and copy it

### 1.6 Important: Make App Live
1. Go to **App Review → Permissions and Features**
2. Request permissions:
   - `pages_read_engagement` - to read Facebook page insights
   - `pages_manage_posts` - to publish to Facebook pages
   - `instagram_basic` - to read Instagram data
   - `instagram_content_publish` - to publish to Instagram
3. Submit for review (Meta will approve for business use)
4. Once approved, switch app to **"Live"** mode

---

## Step 2: Create Your TikTok Developer App (For All Users)

### 2.1 Create TikTok Developer Account
1. Go to: https://developers.tiktok.com/
2. Click "Sign Up"
3. Sign up with your business TikTok account
4. Verify email
5. Complete profile

### 2.2 Create ONE TikTok App
1. Go to: https://developer.tiktok.com/dashboard
2. Click "Create App"
3. App Name: `Hawa Social Hub`
4. App Category: **"Business Tools"**
5. App Description: Social media management platform
6. Click "Create"

### 2.3 Configure OAuth
1. Go to **Apps → Your App → Settings**
2. Add redirect URLs:
   - Production: `https://your-domain.com/auth/callback/tiktok`
   - Local: `http://localhost:5175/auth/callback/tiktok`
3. Click "Save"

### 2.4 Get Your Credentials
1. Go to **Apps → Your App → Keys & Tokens**
2. Copy **Client Key**
3. Click "Show" next to **Client Secret** and copy it

### 2.5 Request Permissions
1. In TikTok Developer Dashboard, request these scopes:
   - `user.info.basic` - to read user profile
   - `video.list` - to read user's videos
   - `video.publish` - to publish videos
2. Submit for review
3. Once approved, app will be live

---

## Step 3: Create Your Firebase Project (For All Users)

### 3.1 Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click "Add project"
3. Project name: `hawa-social-hub`
4. Enable Google Analytics (recommended)
5. Click "Create"

### 3.2 Enable Authentication
1. Go to **Build → Authentication**
2. Click "Get Started"
3. Enable **Email/Password**
4. Enable **Google** sign-in

### 3.3 Create Firestore Database
1. Go to **Build → Firestore Database**
2. Click "Create database"
3. Choose location close to your users
4. Choose **Production mode**
5. Click "Enable"

### 3.4 Deploy Security Rules
1. Go to **Build → Firestore Database → Rules**
2. Copy content from `firestore.rules`
3. Paste into rules editor
4. Click "Publish"

### 3.5 Deploy Indexes
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Run: `npm run init-firebase`
4. Follow the prompts

### 3.6 Get Firebase Config
1. Go to **Project Settings → Your apps**
2. Click **</>** (web) icon
3. Copy all configuration values

---

## Step 4: Update Production .env

Create a production `.env` file with YOUR credentials:

```env
# App Mode
VITE_APP_MODE=production

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Meta Configuration (Facebook/Instagram) - YOUR credentials
VITE_META_APP_ID=your_meta_app_id
VITE_META_APP_SECRET=your_meta_app_secret

# TikTok Configuration - YOUR credentials
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# Cloudinary Configuration (Optional)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Configuration (Optional)
VITE_AI_API_KEY=
VITE_AI_PROVIDER=openai

# Default Settings
VITE_DEFAULT_TIMEZONE=Indian/Maldives
VITE_DEFAULT_LANGUAGE=en
VITE_DEFAULT_CURRENCY=MVR
```

---

## Step 5: Deploy to Production

### 5.1 Choose a Platform
- **Vercel** (recommended): `vercel.json` is already configured
- **Netlify**: Simple drag-and-drop deployment
- **Firebase Hosting**: Integrated with your Firebase project

### 5.2 Deploy to Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Add environment variables in Vercel dashboard
5. Your app will be live at: `https://your-app.vercel.app`

### 5.3 Set Custom Domain
1. In Vercel dashboard, go to **Settings → Domains**
2. Add your custom domain (e.g., `hawasocialhub.com`)
3. Update DNS records as instructed
4. Update OAuth redirect URLs in Meta and TikTok to use your custom domain

---

## Step 6: What Your Customers See

Your customers will have a simple experience:

1. **Sign Up**
   - Go to your website
   - Click "Sign Up"
   - Enter email/password or sign in with Google
   - Account created

2. **Onboarding**
   - Welcome screen
   - Create their business profile
   - Connect social media accounts

3. **Connect Facebook**
   - Click "Connect Facebook"
   - Popup opens with Facebook login
   - They authorize YOUR app
   - Select their Facebook page
   - Connected!

4. **Connect Instagram**
   - Click "Connect Instagram"
   - Popup opens with Instagram login
   - They authorize YOUR app
   - Connected!

5. **Connect TikTok**
   - Click "Connect TikTok"
   - Popup opens with TikTok login
   - They authorize YOUR app
   - Connected!

6. **Start Using**
   - Create posts
   - Schedule content
   - View analytics
   - Manage all accounts from one place

---

## Important Notes

### Security
- **Never share your .env file** - it contains your API secrets
- Use environment variables in production (never hardcode)
- Regularly rotate your API secrets
- Monitor API usage to prevent abuse

### Rate Limits
- Your Meta app has rate limits for ALL users combined
- Monitor usage in Meta Developer Dashboard
- Consider upgrading to higher tiers if needed
- Same for TikTok - monitor combined usage

### Scaling
- Firebase has generous free tier (50K reads/day)
- Upgrade to Blaze plan for production
- Consider Firebase Analytics to track usage
- Set up billing alerts

### Compliance
- Meta requires app review for certain permissions
- TikTok requires app review for publishing
- Ensure you have proper privacy policy
- Comply with GDPR if serving EU users
- Comply with data retention policies

---

## Pricing Considerations

### Your Costs
- Firebase: Free tier → Blaze plan (~$25/month for moderate usage)
- Meta: Free for basic usage
- TikTok: Free tier available
- Hosting: Vercel free → Pro ($20/month)
- Total: ~$45-50/month for initial scale

### Customer Pricing
- Free tier: Limited posts per month
- Basic tier: $10-20/month
- Pro tier: $30-50/month
- Enterprise tier: Custom pricing

---

## Support for Customers

### Documentation
- Create user-facing documentation
- Video tutorials for connecting accounts
- FAQ section
- Contact support form

### Onboarding
- Email welcome sequence
- In-app walkthrough
- Setup wizard
- Progress indicators

### Troubleshooting
- Common issues guide
- Connection error messages
- Reconnection flow
- Account status indicators

---

## Next Steps

1. Complete Steps 1-5 above
2. Test the full flow yourself
3. Create a test user account
4. Connect your own social accounts
5. Test post creation and publishing
6. Deploy to production
7. Set up payment processing (Stripe)
8. Create landing page
9. Start marketing
10. Onboard first customers

---

## Need Help?

- Firebase: https://firebase.google.com/support
- Meta Developers: https://developers.facebook.com/support/
- TikTok Developers: https://developers.tiktok.com/support/
- Vercel: https://vercel.com/support
