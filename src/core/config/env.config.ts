//  /src/core/config/env.config.ts

import { z } from 'zod';

const envSchema = z.object({
  // Core
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SOCKET_URL: z.string().url(),
  EXPO_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']),

  // Seguridad
  EXPO_PUBLIC_JWT_ALGORITHM: z.string().default('HS256'),
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(10),

  // Resiliencia (Transformamos a número para uso directo en código)
  EXPO_PUBLIC_API_TIMEOUT: z.string().default('15000').transform(Number),
  EXPO_PUBLIC_MAX_RETRIES: z.string().default('3').transform(Number),
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
