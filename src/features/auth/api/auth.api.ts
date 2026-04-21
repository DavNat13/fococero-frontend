// src/features/auth/api/auth.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';
import type { RegisterGuestPayload, RegisterFullPayload, Usuario } from '../model/auth.types';
import { AuthResponseDTOSchema, mapUsuarioDtoToDomain } from './auth.dto';

// ============================================================================
// UTILIDAD INTERNA DE VALIDACIÓN DE CONTRATOS
// ============================================================================

/**
 * Procesa la respuesta cruda de Axios, valida matemáticamente que el backend
 * haya respetado el JSON acordado, y traduce los datos a nuestro Dominio.
 */
const processAuthResponse = (rawData: unknown): ApiResponse<Usuario> => {
  // 1. Verificamos el JSON del backend contra nuestro esquema estricto
  const parseResult = AuthResponseDTOSchema.safeParse(rawData);

  if (!parseResult.success) {
    // Aquí en producción enviaríamos parseResult.error a Sentry / Datadog
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

  // 2. Si el contrato se respetó, traducimos a nuestra entidad limpia
  return {
    success: true,
    data: mapUsuarioDtoToDomain(parseResult.data.usuario),
  };
};

// ============================================================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================================================

export const authApi = {
  registerGuest: async (payload: RegisterGuestPayload): Promise<ApiResponse<Usuario>> => {
    const response = await apiClient.post<unknown>('/auth/register-guest', payload);

    // Si hubo error HTTP (Ej: 400, 500, Sin Red), retornamos directamente
    if (!response.success) return response;

    // Si fue 200 OK, pasamos la data por nuestra Aduana Estricta
    return processAuthResponse(response.data);
  },

  registerFull: async (payload: RegisterFullPayload): Promise<ApiResponse<Usuario>> => {
    const response = await apiClient.post<unknown>('/auth/register-full', payload);
    if (!response.success) return response;
    return processAuthResponse(response.data);
  },

  getProfile: async (): Promise<ApiResponse<Usuario>> => {
    const response = await apiClient.get<unknown>('/auth/me');
    if (!response.success) return response;
    return processAuthResponse(response.data);
  },

  syncFcmToken: async (fcmToken: string): Promise<ApiResponse<void>> => {
    return await apiClient.patch('/auth/me/fcm-token', { fcm_token: fcmToken });
  },
};
