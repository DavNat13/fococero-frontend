// src/features/auth/api/auth.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';
import type { RegisterGuestPayload } from '../model/auth.types';
import { Usuario } from '@entities/usuario';

export interface LoginCredentials {
  rut: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<Usuario>> => {
    return apiClient.postPublic<Usuario>('/api/auth/login', credentials);
  },

  registerGuest: async (payload: RegisterGuestPayload): Promise<ApiResponse<Usuario>> => {
    return apiClient.postPublic<Usuario>('/api/auth/register-guest', payload);
  },

  registerFull: async (_payload: RegisterGuestPayload): Promise<ApiResponse<Usuario>> => {
    throw new Error('/api/auth/register-full no está implementado en el backend');
  },

  // Placeholder para Google Auth - implementar después
  registerGoogle: async (_payload: { googleToken: string }): Promise<ApiResponse<Usuario>> => {
    return {
      success: false,
      error: { message: 'Google Auth no disponible aún', code: 'INTERNAL_SERVER_ERROR' },
    };
  },
};
