// src/core/config/firebase.config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEnv } from './env.config';

declare module 'firebase/auth' {
  export function getReactNativePersistence(
    storage: typeof AsyncStorage,
  ): import('firebase/auth').Persistence;
}

let app: FirebaseApp | undefined;
let auth: ReturnType<typeof initializeAuth> | undefined;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    const ENV = getEnv();
    const firebaseConfig = {
      apiKey: ENV.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: ENV.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: ENV.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: ENV.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      appId: ENV.EXPO_PUBLIC_FIREBASE_APP_ID,
    };
    const existingApps = getApps();
    app = existingApps.find((a) => a.name === '[DEFAULT]') ?? initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseAuth = () => {
  if (!auth) {
    auth = initializeAuth(getFirebaseApp(), {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  return auth;
};

export const getGoogleClientId = (): string | undefined => {
  const ENV = getEnv();
  return ENV.EXPO_PUBLIC_FIREBASE_CLIENT_ID;
};
