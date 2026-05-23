//  /src/core/config/env.config.ts

import { z } from 'zod';

const envSchema = z.object({
  // API Gateway (BFF)
  EXPO_PUBLIC_API_GATEWAY_URL: z.string().url(),

  // Firebase Web Config
  EXPO_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
  EXPO_PUBLIC_FIREBASE_APP_ID: z.string(),
  EXPO_PUBLIC_FIREBASE_CLIENT_ID: z.string().optional(),

  // Core
  EXPO_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']),

  // Resiliencia
  EXPO_PUBLIC_API_TIMEOUT: z.string().default('30000').transform(Number),
  EXPO_PUBLIC_OFFLINE_SYNC_INTERVAL: z.string().default('30000').transform(Number),

  // Observabilidad
  EXPO_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.string().length(0)),
  EXPO_PUBLIC_LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
});

export const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Error de configuración en .env:',
      JSON.stringify(parsed.error.format(), null, 2),
    );
    throw new Error('Variables de entorno inválidas. Revisa tu archivo .env');
  }

  return parsed.data;
};

// Exportamos la constante ENV ya validada y tipada
export const ENV = validateEnv();
