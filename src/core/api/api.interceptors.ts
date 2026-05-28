// src/core/api/api.interceptors.ts

import { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { ApiError } from './api.errors';
import { ENV } from '../config/env.config';
import { useAuthStore } from '@features/auth/model/auth.store';
import { generateUUID } from '@shared/utils/uuid';

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

  const firebaseToken = useAuthStore.getState().firebaseToken;
  if (firebaseToken) {
    config.headers.Authorization = `Bearer ${firebaseToken}`;
  }

  const internalToken = ENV.EXPO_PUBLIC_INTERNAL_TOKEN;
  if (internalToken) {
    config.headers['x-internal-token'] = internalToken;
  } else if (__DEV__) {
    console.warn('[API] x-internal-token no configurado — solicitudes sin identificación interna');
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
