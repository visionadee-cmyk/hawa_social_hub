# Hawa Social Hub

**CREATE ONCE. PUBLISH EVERYWHERE. MEASURE EVERYTHING.**

A professional social media management SaaS platform that allows you to create content once and publish it to multiple social media platforms from one place.

## Features

- **Multi-Platform Publishing**: Publish to Facebook, Instagram, and TikTok simultaneously
- **Unified Analytics**: Track performance across all platforms in one dashboard
- **Content Calendar**: Schedule posts and manage your content strategy
- **Team Collaboration**: Manage team members with role-based permissions
- **Demo Mode**: Test the entire application without real API credentials
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **PWA Support**: Installable as a Progressive Web App

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Recharts
- Lucide Icons

### Backend
- Firebase (Authentication, Firestore, Storage, Cloud Functions)
- Cloudinary (Media storage)

### Deployment
- Vercel
- GitHub

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hawa-social-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   For **Demo Mode** (default - no credentials required):
   ```env
   VITE_APP_MODE=demo
   ```

   For **Development/Production Mode**, configure:
   ```env
   VITE_APP_MODE=development
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
   VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   VITE_META_APP_ID=your_meta_app_id
   VITE_META_APP_SECRET=your_meta_app_secret
   VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
   VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Firebase Setup

### For Demo Mode
No Firebase setup required. The application uses simulated data.

### For Development/Production

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project

2. **Enable Authentication**
   - Go to Authentication → Sign-in method
   - Enable Email/Password and Google sign-in

3. **Create Firestore Database**
   - Go to Firestore Database → Create Database
   - Choose production mode
   - Deploy the security rules from `firestore.rules`

4. **Deploy Firestore Indexes**
   ```bash
   firebase login
   firebase deploy --only firestore:indexes
   ```

5. **Get Firebase Configuration**
   - Go to Project Settings → General → Your apps
   - Copy the config values to your `.env` file

## Social Platform API Setup

### Facebook/Instagram
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login and Instagram Basic Display products
4. Configure OAuth redirect URLs
5. Copy App ID and App Secret to `.env`

### TikTok
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app
3. Configure OAuth settings
4. Copy Client Key and Client Secret to `.env`

## Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard → Account Details
3. Copy Cloud Name, API Key, and API Secret to `.env`

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── layouts/          # Layout components (MainLayout)
├── hooks/            # Custom React hooks
├── services/         # API services and demo data
├── integrations/     # Platform adapters (Facebook, Instagram, TikTok)
├── firebase/         # Firebase configuration and services
├── cloudinary/       # Cloudinary integration
├── analytics/        # Analytics services
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── contexts/         # React contexts (Auth, Business)
├── stores/           # State management
└── config/           # App configuration

functions/
└── src/              # Firebase Cloud Functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Firebase

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init`
3. Deploy: `firebase deploy`

## Demo Mode

The application runs in Demo Mode by default, which:
- Uses simulated social media accounts
- Generates mock analytics data
- Simulates publishing operations
- Requires no API credentials

To enable real platform integration, set `VITE_APP_MODE=development` or `VITE_APP_MODE=production` in your `.env` file.

## User Roles

- **Super Admin**: Full system access
- **Business Owner**: Full business access
- **Social Media Manager**: Manage posts and campaigns
- **Editor**: Create and edit posts
- **Viewer**: View-only access

## Security

- Firebase Authentication for user management
- Firestore Security Rules for data protection
- Role-based access control
- OAuth for social platform connections
- No social media passwords stored

## License

MIT

## Support

For support, email support@hawasocialhub.com
