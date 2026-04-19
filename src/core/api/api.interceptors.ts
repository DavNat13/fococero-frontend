// src/core/api/api.interceptors.ts

import { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { ApiError } from './api.errors';

// ============================================================================
// TIPOS Y ESTADO DEL MUTEX
// ============================================================================

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _requestStartTime?: number;
}

interface RetryQueueItem {
  resolve: (token: string) => void;
  reject: (error: ApiError) => void;
}

let isRefreshing = false;
let failedQueue: RetryQueueItem[] = [];

const processQueue = (error: ApiError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

// ============================================================================
// 1. ESCUDO DE SALIDA (REQUEST)
// ============================================================================

export const requestInterceptor = (config: CustomAxiosRequestConfig) => {
  // A. Telemetría: Registro del momento exacto de salida
  config._requestStartTime = Date.now();

  // B. Observabilidad: Trazabilidad distribuida
  if (!config.headers['X-Request-ID']) {
    config.headers['X-Request-ID'] = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // C. Prevención de Duplicados (Idempotencia para mutaciones)
  const isMutation = ['post', 'put', 'patch', 'delete'].includes(
    config.method?.toLowerCase() || '',
  );
  if (isMutation && !config.headers['Idempotency-Key']) {
    config.headers['Idempotency-Key'] = config.headers['X-Request-ID'];
  }

  // D. Inyección de Seguridad
  // TODO: Conectar a Zustand / MMKV en Fase 2
  const token = null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
    // Opcional: Console log en modo debug o envío a Sentry de métricas lentas
    if (executionTimeMs > 2000) {
      console.warn(`[API] Latencia alta en ${config.url}: ${executionTimeMs}ms`);
    }
  }

  return response;
};

// ============================================================================
// 3. ESCUDO DE ENTRADA (MUTE DE ERRORES Y REFRESH TOKEN)
// ============================================================================

export const responseErrorInterceptor = async (
  error: AxiosError,
  axiosInstance: AxiosInstance,
): Promise<never> => {
  const appError = ApiError.from(error);
  const originalRequest = error.config as CustomAxiosRequestConfig;

  // Calculamos latencia incluso si falló
  if (originalRequest?._requestStartTime) {
    const executionTimeMs = Date.now() - originalRequest._requestStartTime;
    console.debug(`[API ERROR] ${originalRequest.url} falló en ${executionTimeMs}ms`);
  }

  // Bypass para errores que no son de sesión o ya fueron reintentados
  if (!originalRequest || appError.code !== 'UNAUTHORIZED' || originalRequest._retry) {
    return Promise.reject(appError);
  }

  // A. Lógica de Encolamiento (Si ya estamos refrescando el token en otro hilo)
  if (isRefreshing) {
    try {
      const newToken = await new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // B. Inicio de Mutex (Bloqueamos la puerta)
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    // TODO: Ejecutar fetch real al endpoint de refresh en Fase 2
    const newAccessToken = 'mock_new_token_for_now';

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    // Liberamos peticiones retenidas
    processQueue(null, newAccessToken);

    return await axiosInstance(originalRequest);
  } catch (refreshError) {
    const fatalError = ApiError.from(refreshError);

    // Matamos la cola
    processQueue(fatalError);

    // TODO: Ejecutar logout estricto (useAuthStore.getState().logout())

    return Promise.reject(fatalError);
  } finally {
    isRefreshing = false;
  }
};
