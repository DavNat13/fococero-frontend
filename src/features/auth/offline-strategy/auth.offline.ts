// src/features/auth/offline-strategy/auth.offline.ts

import { offlineSync } from '@core/offline';
import { RegisterFormData } from '../model/auth.schemas';
import { Usuario, UserRole, UserStatus, Rut } from '@entities/usuario';

export const authOfflineStrategy = {
  createOptimisticUser: (data: RegisterFormData): Usuario => {
    const now = new Date().toISOString();
    return {
      id: Math.floor(Math.random() * 10000) + 100000,
      rut: data.rut as Rut,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,

      rol: UserRole.INVITADO,
      estado: UserStatus.ACTIVO,
      created_at: now,
      updated_at: now,
    };
  },

  queueRegister: async (data: RegisterFormData) => {
    await offlineSync.addTask({
      url: '/api/auth/register-guest',
      method: 'post',
      payload: data,
    });
  },
};
