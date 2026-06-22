// src/core/api/api.client.ts

import axios, { AxiosRequestConfig } from 'axios';
import { ENV } from '../config/env.config';
import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from './api.interceptors';
import type { ApiResponse, ApiSuccess, ApiFailure } from './api.types';
import { ApiError } from './api.errors';

// 1. EL MOTOR BASE (INSTANCIA SINGLETON DE AXIOS)
const axiosInstance = axios.create({
  baseURL: ENV.EXPO_PUBLIC_API_URL,
  timeout: ENV.EXPO_PUBLIC_API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. CONEXIÓN DE LOS ESCUDOS (INTERCEPTORES)
axiosInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

axiosInstance.interceptors.response.use(responseInterceptor, (error) =>
  responseErrorInterceptor(error, axiosInstance),
);

// 3. EL ENVOLTORIO SEGURO (RESULT PATTERN WRAPPER)
// Este wrapper atrapa las excepciones de red y las convierte en valores de retorno
// predecibles, eliminando la necesidad de usar try/catch en la UI.

async function executeRequest<T>(request: Promise<any>): Promise<ApiResponse<T>> {
  try {
    const response = await request;

    // Si Axios resolvió la promesa, mapeamos al contrato ApiSuccess<T>
    const successResult: ApiSuccess<T> = {
      success: true,
      data: response.data?.data || response.data, // Soporta si el backend ya envuelve en 'data'
    };

    return successResult;
  } catch (error) {
    // Si Axios o los interceptores rechazaron, mapeamos al contrato ApiFailure
    // Como el interceptor ya pasó esto por ApiError.from(), estamos seguros del tipo.
    const appError = error instanceof ApiError ? error : ApiError.from(error);

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
};
