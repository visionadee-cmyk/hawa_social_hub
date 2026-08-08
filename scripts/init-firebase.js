#!/usr/bin/env node

/**
 * Firebase Initialization Script
 * This script helps initialize Firebase for the Hawa Social Hub project
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const log = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m', // cyan
    success: '\x1b[32m', // green
    warning: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
};

const checkFirebaseCLI = () => {
  try {
    execSync('firebase --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

const installFirebaseCLI = () => {
  log('Installing Firebase CLI...', 'info');
  try {
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
    log('Firebase CLI installed successfully!', 'success');
    return true;
  } catch (error) {
    log('Failed to install Firebase CLI. Please install it manually: npm install -g firebase-tools', 'error');
    return false;
  }
};

const loginToFirebase = () => {
  log('Please login to Firebase...', 'info');
  try {
    execSync('firebase login', { stdio: 'inherit' });
    log('Logged in successfully!', 'success');
    return true;
  } catch (error) {
    log('Failed to login to Firebase.', 'error');
    return false;
  }
};

const initializeFirebaseProject = async () => {
  log('Initializing Firebase project...', 'info');
  
  const projectId = await question('Enter your Firebase project ID: ');
  const rulesPath = path.join(__dirname, '..', 'firestore.rules');
  const indexesPath = path.join(__dirname, '..', 'firestore.indexes.json');

  // Check if files exist
  if (!fs.existsSync(rulesPath)) {
    log('firestore.rules not found in project root!', 'error');
    return false;
  }

  if (!fs.existsSync(indexesPath)) {
    log('firestore.indexes.json not found in project root!', 'error');
    return false;
  }

  try {
    // Initialize Firebase in the project
    log('Initializing Firebase in project directory...', 'info');
    execSync('firebase init firestore', {
      stdio: 'inherit',
      input: Buffer.from(`\n${projectId}\n${rulesPath}\n${indexesPath}\n`)
    });

    log('Firebase initialized successfully!', 'success');
    return true;
  } catch (error) {
    log('Failed to initialize Firebase project.', 'error');
    return false;
  }
};

const deployFirestoreRules = async () => {
  log('Deploying Firestore security rules...', 'info');
  
  const confirm = await question('Do you want to deploy Firestore rules now? (yes/no): ');
  if (confirm.toLowerCase() !== 'yes') {
    log('Skipping Firestore rules deployment.', 'warning');
    return true;
  }

  try {
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    log('Firestore rules deployed successfully!', 'success');
    return true;
  } catch (error) {
    log('Failed to deploy Firestore rules.', 'error');
    return false;
  }
};

const deployFirestoreIndexes = async () => {
  log('Deploying Firestore indexes...', 'info');
  
  const confirm = await question('Do you want to deploy Firestore indexes now? (yes/no): ');
  if (confirm.toLowerCase() !== 'yes') {
    log('Skipping Firestore indexes deployment.', 'warning');
    return true;
  }

  try {
    execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
    log('Firestore indexes deployed successfully!', 'success');
    return true;
  } catch (error) {
    log('Failed to deploy Firestore indexes.', 'error');
    return false;
  }
};

const updateEnvFile = async () => {
  log('Updating .env file...', 'info');
  
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    log('.env file not found. Please create it first.', 'error');
    return false;
  }

  const apiKey = await question('Enter your Firebase API Key: ');
  const authDomain = await question('Enter your Firebase Auth Domain: ');
  const projectId = await question('Enter your Firebase Project ID: ');
  const storageBucket = await question('Enter your Firebase Storage Bucket: ');
  const messagingSenderId = await question('Enter your Firebase Messaging Sender ID: ');
  const appId = await question('Enter your Firebase App ID: ');

  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(/VITE_FIREBASE_API_KEY=.*/, `VITE_FIREBASE_API_KEY=${apiKey}`);
  envContent = envContent.replace(/VITE_FIREBASE_AUTH_DOMAIN=.*/, `VITE_FIREBASE_AUTH_DOMAIN=${authDomain}`);
  envContent = envContent.replace(/VITE_FIREBASE_PROJECT_ID=.*/, `VITE_FIREBASE_PROJECT_ID=${projectId}`);
  envContent = envContent.replace(/VITE_FIREBASE_STORAGE_BUCKET=.*/, `VITE_FIREBASE_STORAGE_BUCKET=${storageBucket}`);
  envContent = envContent.replace(/VITE_FIREBASE_MESSAGING_SENDER_ID=.*/, `VITE_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}`);
  envContent = envContent.replace(/VITE_FIREBASE_APP_ID=.*/, `VITE_FIREBASE_APP_ID=${appId}`);

  fs.writeFileSync(envPath, envContent);
  log('.env file updated successfully!', 'success');
  return true;
};

const main = async () => {
  log('=== Hawa Social Hub - Firebase Initialization ===', 'info');
  log('', 'reset');

  // Check Firebase CLI
  if (!checkFirebaseCLI()) {
    log('Firebase CLI is not installed.', 'warning');
    const install = await question('Do you want to install Firebase CLI? (yes/no): ');
    if (install.toLowerCase() === 'yes') {
      if (!installFirebaseCLI()) {
        process.exit(1);
      }
    } else {
      log('Please install Firebase CLI manually: npm install -g firebase-tools', 'error');
      process.exit(1);
    }
  }

  // Login to Firebase
  const login = await question('Are you logged in to Firebase CLI? (yes/no): ');
  if (login.toLowerCase() !== 'yes') {
    if (!loginToFirebase()) {
      process.exit(1);
    }
  }

  // Initialize Firebase project
  if (!await initializeFirebaseProject()) {
    process.exit(1);
  }

  // Deploy Firestore rules
  if (!await deployFirestoreRules()) {
    process.exit(1);
  }

  // Deploy Firestore indexes
  if (!await deployFirestoreIndexes()) {
    process.exit(1);
  }

  // Update .env file
  const updateEnv = await question('Do you want to update your .env file with Firebase credentials? (yes/no): ');
  if (updateEnv.toLowerCase() === 'yes') {
    if (!await updateEnvFile()) {
      process.exit(1);
    }
  }

  log('', 'reset');
  log('=== Firebase Initialization Complete! ===', 'success');
  log('', 'reset');
  log('Next steps:', 'info');
  log('1. Update your .env file with Meta (Facebook/Instagram) credentials', 'info');
  log('2. Update your .env file with TikTok credentials', 'info');
  log('3. Update your .env file with Cloudinary credentials (optional)', 'info');
  log('4. Restart your development server: npm run dev', 'info');
  log('', 'reset');

  rl.close();
};

main().catch((error) => {
  log(`Error: ${error.message}`, 'error');
  rl.close();
  process.exit(1);
});
