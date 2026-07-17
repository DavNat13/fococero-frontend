// src/core/api/api.client.tss

import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { getEnv } from '../config/env.config';
import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from './api.interceptors';
import type { ApiResponse, ApiSuccess, ApiFailure } from './api.types';
import { ApiError } from './api.errors';

const ENV = getEnv();

const axiosInstance = axios.create({
  baseURL: ENV.EXPO_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000',
  timeout: ENV.EXPO_PUBLIC_API_TIMEOUT || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. CONEXIÓN DE LOS ESCUDOS (INTERCEPTORES))))
axiosInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

axiosInstance.interceptors.response.use(responseInterceptor, (error) =>
  responseErrorInterceptor(error, axiosInstance),
);

// 3. EL ENVOLTORIO SEGURO (RESULT PATTERN WRAPPER)
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';
const log = isDev ? console.log : () => {};

const defaultTransform = <T>(data: unknown): T =>
  (data as any)?.usuario ?? (data as any)?.data ?? (data as any)?.datos ?? (data as T);

async function executeRequest<T>(
  request: Promise<any>,
  transform?: (data: unknown) => T,
): Promise<ApiResponse<T>> {
  try {
    const response = await request;

    log('[API] Raw response:', JSON.stringify(response.data, null, 2));

    const extract = transform || defaultTransform<T>;
    const successResult: ApiSuccess<T> = {
      success: true,
      data: extract(response.data),
    };

    return successResult;
  } catch (error) {
    const appError = error instanceof ApiError ? error : ApiError.from(error);

    if (isDev) {
      console.error('[API] Request failed:', {
        code: appError.code,
        message: appError.message,
        status: (error as AxiosError)?.response?.status,
      });
    }

    const failureResult: ApiFailure = {
      success: false,
      error: appError.toUIFormat(),
    };

    return failureResult;
  }
}

// ============================================================================
// 4. CLIENTE HTTP EXPORTADO (INTERFAZ PÚBLICA)
// ============================================================================

export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    executeRequest<T>(axiosInstance.get(url, config)),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    executeRequest<T>(axiosInstance.post(url, data, config)),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    executeRequest<T>(axiosInstance.put(url, data, config)),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    executeRequest<T>(axiosInstance.patch(url, data, config)),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    executeRequest<T>(axiosInstance.delete(url, config)),

  // Versión pública que no ejecuta logout en caso de 401 (para auth endpoints)
  postPublic: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    transform?: (data: unknown) => T,
  ) => executeRequestPublic<T>(axiosInstance.post(url, data, config), transform),
};

// Versión pública que no maneja errores de auth
async function executeRequestPublic<T>(
  request: Promise<any>,
  transform?: (data: unknown) => T,
): Promise<ApiResponse<T>> {
  try {
    const response = await request;

    log('[API Public] Raw response:', JSON.stringify(response.data, null, 2));

    const extract = transform || defaultTransform<T>;
    const successResult: ApiSuccess<T> = {
      success: true,
      data: extract(response.data),
    };
    return successResult;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (isDev) {
      console.error('[API Public] Request failed:', {
        code: axiosError?.response?.status,
        message: axiosError?.message,
        url: axiosError?.config?.url,
      });
    }

    const appError = error instanceof ApiError ? error : ApiError.from(error);
    const failureResult: ApiFailure = {
      success: false,
      error: appError.toUIFormat(),
    };
    return failureResult;
  }
}
