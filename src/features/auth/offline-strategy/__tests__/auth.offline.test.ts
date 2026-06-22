// src/features/auth/offline-strategy/__tests__/auth.offline.test.ts

jest.mock('@core/offline', () => ({
  offlineSync: {
    addTask: jest.fn(),
  },
}));

jest.mock('@entities/usuario', () => ({
  Usuario: class UsuarioMock {},
  UserRole: { INVITADO: 'INVITADO' },
  UserStatus: { ACTIVO: 'ACTIVO' },
  Rut: class RutMock {},
}));

import { authOfflineStrategy } from '../auth.offline';

describe('authOfflineStrategy', () => {
  describe('createOptimisticUser', () => {
    it('crea un usuario optimista con los datos proporcionados', () => {
      const data = {
        rut: '12.345.678-9' as any,
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '+56912345678',
      };

      const user = authOfflineStrategy.createOptimisticUser(data);

      expect(user).toMatchObject({
        rut: '12.345.678-9',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '+56912345678',
        rol: 'INVITADO',
        estado: 'ACTIVO',
      });
      expect(user.id).toBeGreaterThanOrEqual(100000);
      expect(typeof user.created_at).toBe('string');
      expect(typeof user.updated_at).toBe('string');
    });
  });

  describe('queueRegister', () => {
    it('agrega tarea de registro offline', async () => {
      const data = {
        rut: '12.345.678-9' as any,
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '+56912345678',
      };

      const { offlineSync } = require('@core/offline');
      await authOfflineStrategy.queueRegister(data);

      expect(offlineSync.addTask).toHaveBeenCalledWith({
        url: '/api/auth/register-guest',
        method: 'post',
        payload: data,
      });
    });
  });
});
