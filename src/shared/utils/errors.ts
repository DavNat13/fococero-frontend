// src/shared/utils/errors.ts
import { MESSAGES } from '../constants/messages';

export interface AppError {
  code: string;
  message: string;
  isNetworkError: boolean;
}

/**
 * Toma cualquier tipo de error (Axios, TypeError, String) y lo convierte en un formato predecible.
 */
export const parseError = (error: unknown): AppError => {
  // Es un error de red (Sin internet)
  if (error instanceof Error && error.message.includes('Network Error')) {
    return {
      code: 'NETWORK_OFFLINE',
      message: MESSAGES.NETWORK.OFFLINE,
      isNetworkError: true,
    };
  }

  // Es un error general de JS
  if (error instanceof Error) {
    return {
      code: 'APP_ERROR',
      message: error.message,
      isNetworkError: false,
    };
  }

  // Es un error desconocido
  return {
    code: 'UNKNOWN',
    message: MESSAGES.NETWORK.SERVER_ERROR,
    isNetworkError: false,
  };
};
