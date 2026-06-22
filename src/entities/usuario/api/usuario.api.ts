// src/entities/usuario/api/usuario.api.ts

import { apiClient } from '@core/api';
import { Usuario, UpdateProfileDTO } from '../model/usuario.types';

export const usuarioApi = {
  /**
   * Obtiene la información del usuario actual (basado en el token)
   */
  getMe: async () => {
    return await apiClient.get<Usuario>('/auth/me');
  },

  /**
   * Actualiza datos básicos del perfil
   */
  updateProfile: async (data: UpdateProfileDTO) => {
    return await apiClient.patch<Usuario>('/auth/me', data);
  },

  /**
   * Sincroniza el token de notificaciones Push
   */
  updateFcmToken: async (fcmToken: string) => {
    return await apiClient.patch('/auth/me/fcm-token', { fcmToken });
  },
};
