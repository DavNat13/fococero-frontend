// src/features/auth/api/auth.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';
import type { RegisterGuestPayload, RegisterFullPayload } from '../model/auth.types';
import { Usuario } from '@entities/usuario';

export const authApi = {
  registerGuest: async (payload: RegisterGuestPayload): Promise<ApiResponse<Usuario>> => {
    return apiClient.post<Usuario>('/api/v1/auth/register-guest', payload);
  },

  registerFull: async (payload: RegisterFullPayload): Promise<ApiResponse<Usuario>> => {
    return apiClient.post<Usuario>('/api/v1/auth/register-full', payload);
  },
};
