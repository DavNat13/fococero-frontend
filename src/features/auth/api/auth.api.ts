// src/features/auth/api/auth.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';
import type { RegisterGuestPayload, RegisterFullPayload } from '../model/auth.types';
import { Usuario } from '@entities/usuario';
import { AuthResponseDTOSchema, mapUsuarioDtoToDomain } from './auth.dto';

const processAuthResponse = (rawData: unknown): ApiResponse<Usuario> => {
  const parseResult = AuthResponseDTOSchema.safeParse(rawData);

  if (!parseResult.success) {
    console.error(
      '[API_CONTRACT_BREACH] El backend envió datos malformados:',
      parseResult.error.format(),
    );

    return {
      success: false,
      error: {
        code: 'CONTRACT_BREACH',
        message: 'Respuesta inválida del servidor. Contacte a soporte.',
      },
    };
  }

  return {
    success: true,
    data: mapUsuarioDtoToDomain(parseResult.data.usuario),
  };
};

export const authApi = {
  registerGuest: async (payload: RegisterGuestPayload): Promise<ApiResponse<Usuario>> => {
    const response = await apiClient.post<unknown>('/auth/register-guest', payload);

    if (!response.success) return response;
    return processAuthResponse(response.data);
  },

  registerFull: async (payload: RegisterFullPayload): Promise<ApiResponse<Usuario>> => {
    const response = await apiClient.post<unknown>('/auth/register-full', payload);

    if (!response.success) return response;
    return processAuthResponse(response.data);
  },
};
