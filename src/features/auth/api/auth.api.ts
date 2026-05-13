// src/features/auth/api/auth.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';
import type { RegisterGuestPayload, RegisterFullPayload } from '../model/auth.types';
import { Usuario } from '@entities/usuario';

export interface LoginCredentials {
  rut: string;
  password: string;
}

export interface RegisterGooglePayload {
  googleToken: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<Usuario>> => {
    return apiClient.post<Usuario>('/api/auth/login', credentials);
  },

  registerGuest: async (payload: RegisterGuestPayload): Promise<ApiResponse<Usuario>> => {
    return apiClient.post<Usuario>('/api/auth/register-guest', payload);
  },

  registerFull: async (payload: RegisterFullPayload): Promise<ApiResponse<Usuario>> => {
    return apiClient.post<Usuario>('/api/auth/register-full', payload);
  },

  registerGoogle: async (payload: RegisterGooglePayload): Promise<ApiResponse<Usuario>> => {
    return apiClient.post<Usuario>('/api/auth/register-google', payload);
  },
};
