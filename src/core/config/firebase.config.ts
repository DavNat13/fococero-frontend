// src/core/config/firebase.config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { ENV } from './env.config';

const firebaseConfig = {
  apiKey: ENV.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: ENV.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: ENV.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: ENV.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: ENV.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    const existingApps = getApps();
    app = existingApps.find((a) => a.name === '[DEFAULT]') ?? initializeApp(firebaseConfig);
  }
  return app;
};

export const getGoogleClientId = (): string | undefined => {
  return ENV.EXPO_PUBLIC_FIREBASE_CLIENT_ID;
};