// src/features/auth/offline-strategy/auth.offline.ts

import { offlineSync } from '../../../core/offline';
import { RegisterFormData } from '../model/auth.schemas';
import { Usuario, UserRole, UserStatus, Rut } from '../model/auth.types';

export const authOfflineStrategy = {
  createOptimisticUser: (data: RegisterFormData): Usuario => {
    const now = new Date().toISOString();
    return {
      id: -Math.floor(Math.random() * 10000),
      rut: data.rut as Rut,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      email: null,
      rol: UserRole.INVITADO,
      estado: UserStatus.ACTIVO,
      fcmToken: null,
      createdAt: now,
      updatedAt: now,
    };
  },

  queueRegister: async (data: RegisterFormData) => {
    await offlineSync.addTask({
      url: '/auth/register-guest',
      method: 'post',
      payload: data,
    });
  },
};
