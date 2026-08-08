# Hawa Social Hub - Production Setup Checklist

This checklist guides you through the complete setup process to make Hawa Social Hub production-ready with real social media connections.

---

## Phase 1: Meta Developer Setup (Facebook & Instagram)

### Create Meta Developer App
- [ ] Go to https://developers.facebook.com/
- [ ] Sign up/log in
- [ ] Click "Create App"
- [ ] Select "Business" app type
- [ ] App Name: `Hawa Social Hub`
- [ ] App Contact Email: your email
- [ ] Select use case: "Manage and grow a business"
- [ ] Complete business information
- [ ] Click "Create App"

### Configure Instagram Business Login
- [ ] Add "Instagram" product to your app
- [ ] Click "Set up Instagram business login"
- [ ] Add redirect URL: `https://hawa-social-hub.vercel.app/auth/callback/instagram`
- [ ] Save settings
- [ ] Copy Instagram App ID and App Secret

### Configure Facebook Login
- [ ] Add "Facebook Login for Business" product to your app
- [ ] Go to Facebook Login settings
- [ ] Add redirect URL: `https://hawa-social-hub.vercel.app/auth/callback/facebook`
- [ ] Save settings
- [ ] Copy Meta App ID and App Secret

---

## Phase 2: TikTok Developer Setup

### Create TikTok Developer App
- [ ] Go to https://developers.tiktok.com/
- [ ] Sign up and log in
- [ ] Go to https://developer.tiktok.com/dashboard
- [ ] Click "Create App"
- [ ] App Name: `Hawa Social Hub`
- [ ] App Category: "Business Tools"
- [ ] Click "Create"

### Configure TikTok OAuth
- [ ] Go to Apps → Your App → Settings
- [ ] Add redirect URL: `https://hawa-social-hub.vercel.app/auth/callback/tiktok`
- [ ] Save settings
- [ ] Go to Apps → Your App → Keys & Tokens
- [ ] Copy Client Key
- [ ] Copy Client Secret

---

## Phase 3: Firebase Setup

### Create Firebase Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Project name: `hawa-social-hub`
- [ ] Enable Google Analytics (optional)
- [ ] Click "Create"

### Enable Firebase Authentication
- [ ] Go to Build → Authentication
- [ ] Click "Get Started"
- [ ] Enable "Email/Password" sign-in
- [ ] Enable "Google" sign-in
- [ ] Save settings

### Create Firestore Database
- [ ] Go to Build → Firestore Database
- [ ] Click "Create database"
- [ ] Choose location (recommended: closest to your users)
- [ ] Choose "Production mode"
- [ ] Click "Enable"

### Get Firebase Configuration
- [ ] Go to Project Settings → Your apps
- [ ] Click "</>" (web) icon
- [ ] App nickname: `Hawa Social Hub`
- [ ] Click "Register app"
- [ ] Copy all configuration values:
  - [ ] API Key
  - [ ] Auth Domain
  - [ ] Project ID
  - [ ] Storage Bucket
  - [ ] Messaging Sender ID
  - [ ] App ID

---

## Phase 4: Cloudinary Setup (Optional - for media upload)

### Create Cloudinary Account
- [ ] Go to https://cloudinary.com/
- [ ] Sign up for free account
- [ ] Go to Dashboard
- [ ] Copy Cloud Name
- [ ] Copy API Key
- [ ] Copy API Secret

---

## Phase 5: Vercel Environment Variables

### Add Environment Variables to Vercel
- [ ] Go to your Vercel project → Settings → Environment Variables
- [ ] Add `VITE_APP_MODE` = `development`
- [ ] Add `VITE_META_APP_ID` = your Meta App ID
- [ ] Add `VITE_META_APP_SECRET` = your Meta App Secret
- [ ] Add `VITE_TIKTOK_CLIENT_KEY` = your TikTok Client Key
- [ ] Add `VITE_TIKTOK_CLIENT_SECRET` = your TikTok Client Secret
- [ ] Add `VITE_FIREBASE_API_KEY` = your Firebase API Key
- [ ] Add `VITE_FIREBASE_AUTH_DOMAIN` = your Firebase Auth Domain
- [ ] Add `VITE_FIREBASE_PROJECT_ID` = your Firebase Project ID
- [ ] Add `VITE_FIREBASE_STORAGE_BUCKET` = your Firebase Storage Bucket
- [ ] Add `VITE_FIREBASE_MESSAGING_SENDER_ID` = your Firebase Messaging Sender ID
- [ ] Add `VITE_FIREBASE_APP_ID` = your Firebase App ID
- [ ] Add `VITE_CLOUDINARY_CLOUD_NAME` = your Cloudinary Cloud Name (optional)
- [ ] Add `VITE_CLOUDINARY_API_KEY` = your Cloudinary API Key (optional)
- [ ] Add `VITE_CLOUDINARY_API_SECRET` = your Cloudinary API Secret (optional)
- [ ] Save all variables

### Redeploy Application
- [ ] Go to Deployments tab
- [ ] Find latest deployment
- [ ] Click three dots (•••)
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete

---

## Phase 6: Testing

### Test Environment Configuration
- [ ] Go to https://hawa-social-hub.vercel.app
- [ ] Open browser console (F12)
- [ ] Verify no environment errors
- [ ] Verify app is running in development mode

### Test Instagram Connection
- [ ] Go to https://hawa-social-hub.vercel.app/social-accounts
- [ ] Click "Connect Instagram"
- [ ] Verify redirect to Instagram OAuth page
- [ ] Authorize the app
- [ ] Verify redirect back to your app
- [ ] Verify account appears as connected

### Test Facebook Connection
- [ ] Click "Connect Facebook"
- [ ] Verify redirect to Facebook OAuth page
- [ ] Authorize the app
- [ ] Verify redirect back to your app
- [ ] Verify account appears as connected

### Test TikTok Connection
- [ ] Click "Connect TikTok"
- [ ] Verify redirect to TikTok OAuth page
- [ ] Authorize the app
- [ ] Verify redirect back to your app
- [ ] Verify account appears as connected

---

## Phase 7: Firebase Security Rules

### Deploy Firestore Security Rules
- [ ] Go to Firebase Console → Firestore Database
- [ ] Click "Rules" tab
- [ ] Copy security rules from `firestore.rules` file
- [ ] Paste into rules editor
- [ ] Click "Publish"

### Create Firestore Indexes
- [ ] Go to Firebase Console → Firestore Database → Indexes
- [ ] Create composite indexes as needed for queries
- [ ] Or use Firebase CLI to deploy indexes from `firestore.indexes.json`

---

## Phase 8: Production Deployment

### Final Configuration Check
- [ ] Verify all environment variables are set
- [ ] Verify OAuth redirect URLs are correct
- [ ] Verify Firebase is properly configured
- [ ] Verify all social media apps are in correct mode (Development → Live when ready)

### Switch to Production Mode
- [ ] Update `VITE_APP_MODE` to `production` in Vercel
- [ ] Redeploy application
- [ ] Test all connections again

### Domain Configuration (Optional)
- [ ] Add custom domain to Vercel
- [ ] Update OAuth redirect URLs in Meta/TikTok with custom domain
- [ ] Update environment variables if needed

---

## Phase 9: App Review (Meta)

### Submit Instagram App for Review
- [ ] Go to Meta App Dashboard → App Review
- [ ] Click "Submit for Review"
- [ ] Select permissions needed:
  - [ ] instagram_business_basic
  - [ ] instagram_business_manage_messages
  - [ ] instagram_business_manage_comments
  - [ ] instagram_business_content_publish
  - [ ] instagram_business_manage_insights
- [ ] Provide app review information
- [ ] Submit for review
- [ ] Wait for approval

### Submit Facebook App for Review (if needed)
- [ ] Go to App Review
- [ ] Submit for any advanced permissions needed
- [ ] Provide review information
- [ ] Submit for review
- [ ] Wait for approval

---

## Phase 10: Customer Onboarding

### Create User Documentation
- [ ] Write user guide for customers
- [ ] Create video tutorials (optional)
- [ ] Set up help/support system

### Test Customer Flow
- [ ] Create test user account
- [ ] Test sign-up flow
- [ ] Test social media connection flow
- [ ] Verify everything works as expected

---

## Phase 11: Launch

### Go Live
- [ ] Switch Meta apps to "Live" mode
- [ ] Switch TikTok app to "Live" mode
- [ ] Verify all connections work in production
- [ ] Launch to customers

---

## Notes

- **Development Mode**: Use while testing - allows you to connect your own accounts
- **Production Mode**: Use when launching - all customers can connect their accounts
- **App Review**: Meta requires app review for certain permissions before going live
- **Security**: Never commit `.env` file or API secrets to version control
- **Testing**: Always test thoroughly in development mode before going live

---

## Support Resources

- Meta Developers: https://developers.facebook.com/
- TikTok Developers: https://developers.tiktok.com/
- Firebase Console: https://console.firebase.google.com/
- Cloudinary Docs: https://cloudinary.com/documentation
- Vercel Docs: https://vercel.com/docs

---

## Current Status

### Completed
- ✅ Meta Developer app created
- ✅ Instagram business login configured
- ✅ Facebook login configured
- ✅ Meta credentials added to Vercel
- ✅ App deployed to Vercel

### In Progress
- 🔄 Testing Instagram connection
- 🔄 Environment variable verification

### Pending
- ⏳ TikTok Developer app setup
- ⏳ Firebase project setup
- ⏳ Cloudinary setup (optional)
- ⏳ Complete testing of all connections
- ⏳ Firebase security rules deployment
- ⏳ App review submission
- ⏳ Production launch

---

Last updated: August 8, 2026
