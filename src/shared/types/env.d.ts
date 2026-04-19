// src/shared/types/env.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_SOCKET_URL: string;
      EXPO_PUBLIC_ENVIRONMENT: 'development' | 'staging' | 'production';
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      EXPO_PUBLIC_JWT_ALGORITHM: string;
      EXPO_PUBLIC_API_TIMEOUT: string;
      EXPO_PUBLIC_MAX_RETRIES: string;
      EXPO_PUBLIC_OFFLINE_SYNC_INTERVAL: string;
      EXPO_PUBLIC_SENTRY_DSN: string;
      EXPO_PUBLIC_LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
    }
  }
}

export {};
