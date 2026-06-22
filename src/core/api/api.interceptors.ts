// src/core/api/api.interceptors.ts

import { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { ApiError } from './api.errors';
import { generateUUID } from '@shared/utils/uuid';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const getAuthStore = () => require('@features/auth/model/auth.store').useAuthStore;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const getFirebaseAuth = () => require('@core/config/firebase.config').getFirebaseAuth();

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _requestStartTime?: number;
}

// ============================================================================
// 1. ESCUDO DE SALIDA (REQUEST)
// ============================================================================

export const requestInterceptor = (config: CustomAxiosRequestConfig) => {
  config._requestStartTime = Date.now();

  if (!config.headers['X-Request-ID']) {
    config.headers['X-Request-ID'] = generateUUID();
  }

  const firebaseToken = getAuthStore().getState().firebaseToken;
  if (firebaseToken) {
    config.headers.Authorization = `Bearer ${firebaseToken}`;
  }

  // 🛡️ NOTA: El token interno (x-internal-token) NO debe enviarse desde el cliente.
  // Es un mecanismo de confianza entre el API Gateway y los microservicios.
  // Enviarlo desde el frontend expondría el secreto y vulneraría el modelo Zero-Trust.

  config.headers.Accept = 'application/json';
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
};

export const requestErrorInterceptor = (error: unknown) => {
  return Promise.reject(ApiError.from(error));
};

// ============================================================================
// 2. ESCUDO DE ENTRADA (RESPONSE EXITOSO)
// ============================================================================

const MAX_DEPTH = 5;
const MAX_ARRAY_ITEMS = 200;

const normalizeCoordinates = (data: unknown, depth = 0): void => {
  if (depth > MAX_DEPTH) return;
  if (Array.isArray(data)) {
    const len = Math.min(data.length, MAX_ARRAY_ITEMS);
    for (let i = 0; i < len; i++) {
      normalizeCoordinates(data[i], depth + 1);
    }
  } else if (data !== null && typeof data === 'object') {
    for (const key in data as Record<string, unknown>) {
      const val = (data as Record<string, unknown>)[key];
      if ((key === 'latitud' || key === 'longitud') && typeof val === 'string') {
        (data as Record<string, unknown>)[key] = Number(val);
      } else {
        normalizeCoordinates(val, depth + 1);
      }
    }
  }
};

export const responseInterceptor = (response: AxiosResponse) => {
  const config = response.config as CustomAxiosRequestConfig;

  normalizeCoordinates(response.data);

  if (config._requestStartTime) {
    const executionTimeMs = Date.now() - config._requestStartTime;
    if (executionTimeMs > 2000) {
      if (__DEV__) console.warn(`[API] Latencia alta en ${config.url}: ${executionTimeMs}ms`);
    }
  }

  return response;
};

// ============================================================================
// 3. ESCUDO DE ENTRADA (MANEJO DE ERRORES)
// ============================================================================

export const responseErrorInterceptor = async (
  error: AxiosError,
  axiosInstance: AxiosInstance,
): Promise<any> => {
  const appError = ApiError.from(error);

  const isPublic =
    error.config?.url?.includes('/api/auth/') &&
    (error.config?.method === 'post' || error.config?.method === 'get');

  if (appError.code === 'UNAUTHORIZED' && !isPublic && error.config) {
    const store = getAuthStore().getState();

    if (store.status === 'authenticated') {
      try {
        const auth = getFirebaseAuth();
        const newToken = await auth.currentUser?.getIdToken(true);
        if (newToken) {
          getAuthStore().getState().setAuthData(store.user!, newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          const response = await axiosInstance.request(error.config);
          return response;
        }
      } catch {
        // No se pudo refrescar el token — cerrar sesión
      }
      store.logout();
    } else if (store.status === 'guest') {
      try {
        await store.refreshGuestToken();
        const retryResponse = await axiosInstance.request(error.config);
        return retryResponse;
      } catch {
        store.logout();
      }
    }
  }

  return Promise.reject(appError);
};
