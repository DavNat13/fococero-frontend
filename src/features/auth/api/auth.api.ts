// src/features/auth/api/auth.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';
import type { RegisterGuestPayload } from '../model/auth.types';
import type { PerfilBrigadista } from '@entities/usuario';
import { Usuario } from '@entities/usuario';

export interface LoginCredentials {
  rut: string;
  password: string;
}

/** Respuesta del backend en /api/auth/login */
export interface LoginResponse {
  usuario: Usuario;
  firebaseToken: string;
}

/** Respuesta del backend en /api/auth/register-guest */
export interface RegisterResponse {
  usuario: Usuario;
  firebaseToken: string;
}

/** Respuesta del backend en /api/auth/google */
export interface GoogleAuthResponse {
  usuario: Usuario;
  firebaseToken?: string;
}

export interface SetPasswordPayload {
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.postPublic<LoginResponse>(
      '/api/auth/login',
      credentials,
      undefined,
      // Passthrough: devolvemos el objecto completo { usuario, firebaseToken }
      (data) => data as LoginResponse,
    );
  },

  registerGuest: async (payload: RegisterGuestPayload): Promise<ApiResponse<RegisterResponse>> => {
    return apiClient.postPublic<RegisterResponse>(
      '/api/auth/register-guest',
      payload,
      undefined,
      (data) => data as RegisterResponse,
    );
  },

  registerFull: async (_payload: RegisterGuestPayload): Promise<ApiResponse<RegisterResponse>> => {
    throw new Error('registerFull no está habilitado en el frontend');
  },

  registerGoogle: async (payload: {
    googleToken: string;
  }): Promise<ApiResponse<GoogleAuthResponse>> => {
    return apiClient.postPublic<GoogleAuthResponse>(
      '/api/auth/google',
      { token: payload.googleToken },
      undefined,
      (data) => data as GoogleAuthResponse,
    );
  },

  setPassword: async (payload: SetPasswordPayload): Promise<ApiResponse<Usuario>> => {
    return apiClient.post<Usuario>('/api/auth/upgrade-account', { password: payload.password });
  },

  convertirCuenta: async (payload?: { password?: string }): Promise<ApiResponse<Usuario>> => {
    return apiClient.patch<Usuario>('/api/auth/me/convertir', payload);
  },

  getPerfilBrigadista: async (): Promise<
    ApiResponse<{ usuario: Usuario & { perfil_brigadista?: PerfilBrigadista | null } }>
  > => {
    return apiClient.get('/api/auth/me/perfil-brigadista');
  },

  updatePerfilBrigadista: async (
    payload: Partial<PerfilBrigadista>,
  ): Promise<
    ApiResponse<{ usuario: Usuario & { perfil_brigadista?: PerfilBrigadista | null } }>
  > => {
    return apiClient.patch('/api/auth/me/perfil-brigadista', payload);
  },
};
