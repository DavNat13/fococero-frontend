// src/core/api/api.errors.ts

import axios, { AxiosError } from 'axios';
import type { AppErrorCode, ApiErrorDetail } from './api.types';

/**
 * ============================================================================
 * TRADUCTOR DE ERRORES CENTRALIZADO (Patrón Factory)
 * ============================================================================
 * Extiende la clase Error nativa de JS, pero la blinda con propiedades
 * inmutables (readonly) y métodos de telemetría.
 */
export class ApiError extends Error {
  public readonly code: AppErrorCode;
  public readonly validationErrors?: Record<string, string[]>;
  public readonly statusCode?: number;
  public readonly isNetworkError: boolean;

  public constructor(
    code: AppErrorCode,
    message: string,
    statusCode?: number,
    validationErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;

    // Identificador rápido para que la UI sepa si debe mostrar "Revisa tu conexión"
    this.isNetworkError = code === 'NETWORK_ERROR' || code === 'TIMEOUT';

    // Mantiene la traza de ejecución limpia en V8 (Node/Hermes)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * PATRÓN FACTORY: Convierte cualquier error desconocido en un ApiError estricto.
   * Este es el "embudo" por donde pasarán TODAS las peticiones fallidas de la app.
   */
  public static from(error: unknown): ApiError {
    // 1. Si ya es un ApiError (ej. lanzado manualmente), lo dejamos pasar
    if (error instanceof ApiError) {
      return error;
    }

    // 2. Intercepción de errores nativos de Axios
    if (axios.isAxiosError(error)) {
      return ApiError.parseAxiosError(error);
    }

    // 3. Fallos catastróficos de JavaScript (ej. error de sintaxis en el interceptor)
    const fallbackMessage =
      error instanceof Error ? error.message : 'Error desconocido en el cliente';
    return new ApiError('INTERNAL_SERVER_ERROR', fallbackMessage);
  }

  /**
   * Convierte nuestro error en el contrato estricto de la UI que definimos en api.types.ts
   */
  public toUIFormat(): ApiErrorDetail {
    return {
      code: this.code,
      message: this.message,
      ...(this.validationErrors && { validationErrors: this.validationErrors }),
    };
  }

  /**
   * Lógica interna para diseccionar la respuesta de Axios
   */
  private static parseAxiosError(error: AxiosError): ApiError {
    // A. Error por Timeout (El servidor tardó demasiado en responder)
    if (error.code === 'ECONNABORTED') {
      return new ApiError('TIMEOUT', 'La conexión tardó demasiado. Reintente por favor.');
    }

    // B. Error de Red (Modo Avión, sin señal de datos en el bosque)
    if (!error.response) {
      return new ApiError(
        'NETWORK_ERROR',
        'No hay conexión con el servidor. Se guardarán los cambios localmente.',
      );
    }

    // C. El backend respondió, pero con un código de error HTTP (4xx, 5xx)
    const status = error.response.status;
    const backendData = error.response.data as any;

    let message: string;
    let code: AppErrorCode;
    let validationErrors: Record<string, string[]> | undefined;

    if (backendData?.error) {
      if (typeof backendData.error === 'string') {
        message = backendData.error;
        code = ApiError.mapStatusToCode(status);
      } else if (typeof backendData.error === 'object') {
        message =
          backendData.error.message ||
          backendData.error.mensaje ||
          ApiError.getDefaultMessage(status);
        code =
          backendData.error.code || backendData.error.codigo || ApiError.mapStatusToCode(status);
        validationErrors = backendData.error.validationErrors;
      } else {
        message = backendData.msg || ApiError.getDefaultMessage(status);
        code = ApiError.mapStatusToCode(status);
      }
    } else if (backendData?.exito === false && backendData?.error) {
      message =
        backendData.error.mensaje ||
        backendData.error.message ||
        ApiError.getDefaultMessage(status);
      code = ApiError.mapStatusToCode(status);
    } else {
      message = backendData?.msg || ApiError.getDefaultMessage(status);
      code = ApiError.mapStatusToCode(status);
    }

    return new ApiError(code, message, status, validationErrors);
  }

  // Mapeo automático si el backend no envía nuestro formato estricto
  private static mapStatusToCode(status: number): AppErrorCode {
    if (status === 400) return 'VALIDATION_ERROR';
    if (status === 401) return 'UNAUTHORIZED';
    if (status === 403) return 'FORBIDDEN';
    if (status === 404) return 'NOT_FOUND';
    return 'INTERNAL_SERVER_ERROR';
  }

  private static getDefaultMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Los datos enviados son inválidos.';
      case 401:
        return 'Tu sesión ha expirado. Por favor, ingresa nuevamente.';
      case 403:
        return 'No tienes permisos de Brigadista para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no existe.';
      case 500:
        return 'Los servidores de FocoCero están experimentando problemas.';
      default:
        return 'Ocurrió un error inesperado al procesar la solicitud.';
    }
  }
}
