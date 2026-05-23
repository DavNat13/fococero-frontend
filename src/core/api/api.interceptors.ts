// src/core/api/api.interceptors.ts

import { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { ApiError } from './api.errors';
import { useAuthStore } from '@features/auth/model/auth.store';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _requestStartTime?: number;
}

// ============================================================================
// 1. ESCUDO DE SALIDA (REQUEST)
// ============================================================================

export const requestInterceptor = (config: CustomAxiosRequestConfig) => {
  config._requestStartTime = Date.now();

  if (!config.headers['X-Request-ID']) {
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };
    config.headers['X-Request-ID'] = generateUUID();
  }

  const firebaseToken = useAuthStore.getState().firebaseToken;
  if (firebaseToken) {
    config.headers.Authorization = `Bearer ${firebaseToken}`;
  }

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

export const responseInterceptor = (response: AxiosResponse) => {
  const config = response.config as CustomAxiosRequestConfig;

  if (config._requestStartTime) {
    const executionTimeMs = Date.now() - config._requestStartTime;
    if (executionTimeMs > 2000) {
      console.warn(`[API] Latencia alta en ${config.url}: ${executionTimeMs}ms`);
    }
  }

  return response;
};

// ============================================================================
// 3. ESCUDO DE ENTRADA (MANEJO DE ERRORES)
// ============================================================================

export const responseErrorInterceptor = async (
  error: AxiosError,
  _axiosInstance: AxiosInstance,
): Promise<never> => {
  const appError = ApiError.from(error);

  if (appError.code === 'UNAUTHORIZED') {
    useAuthStore.getState().logout();
  }

  return Promise.reject(appError);
};
