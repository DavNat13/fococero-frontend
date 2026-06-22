//  /src/core/config/env.config.ts

import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_GATEWAY_URL: z.string().url(),
  EXPO_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
  EXPO_PUBLIC_FIREBASE_APP_ID: z.string(),
  EXPO_PUBLIC_FIREBASE_CLIENT_ID: z.string().optional(),
  EXPO_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID: z.string().optional(),
  EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS: z.string().optional(),

  EXPO_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
  EXPO_PUBLIC_API_TIMEOUT: z.string().default('30000').transform(Number),
  EXPO_PUBLIC_OFFLINE_SYNC_INTERVAL: z.string().default('30000').transform(Number),
  EXPO_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.string().length(0)),
  EXPO_PUBLIC_LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
});

type EnvType = z.infer<typeof envSchema>;

let cachedEnv: EnvType | null = null;
let envError: string | null = null;

export const getEnv = (): EnvType => {
  if (cachedEnv) return cachedEnv;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const msg = `Variables de entorno inválidas: ${JSON.stringify(parsed.error.format(), null, 2)}`;
    if (!envError) {
      console.error('[ENV]', msg);
      envError = msg;
    }
    const fallback: Record<string, unknown> = {};
    for (const key of Object.keys(envSchema.shape)) {
      fallback[key] = (process.env as Record<string, string>)[key] ?? undefined;
    }
    cachedEnv = envSchema.safeParse(fallback).data ?? ({} as EnvType);
  } else {
    cachedEnv = parsed.data;
  }

  return cachedEnv;
};

export const ENV = new Proxy<EnvType>({} as EnvType, {
  get(_, prop: string) {
    return getEnv()[prop as keyof EnvType];
  },
});
