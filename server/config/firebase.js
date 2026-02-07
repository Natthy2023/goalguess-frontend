import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load service account key from file
let serviceAccount;

try {
  // Look for serviceAccountKey.json in root directory
  const keyPath = path.join(process.cwd(), 'serviceAccountKey.json');
  
  if (fs.existsSync(keyPath)) {
    const keyFile = fs.readFileSync(keyPath, 'utf8');
    serviceAccount = JSON.parse(keyFile);
  } else {
    // Fallback to environment variables
    serviceAccount = {
      type: process.env.FIREBASE_TYPE || 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };
  }

  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.error('Make sure serviceAccountKey.json exists in root directory or .env has Firebase credentials');
  process.exit(1);
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
