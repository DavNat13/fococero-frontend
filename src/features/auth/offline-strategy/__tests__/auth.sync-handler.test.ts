// src/features/auth/offline-strategy/__tests__/auth.sync-handler.test.ts

import { authSyncHandler } from '../auth.sync-handler';

jest.mock('../../model/auth.store', () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

describe('authSyncHandler', () => {
  describe('reconcile', () => {
    it('actualiza setAuthData si el usuario local coincide (mismo rut)', () => {
      const mockSetAuthData = jest.fn();
      const { useAuthStore } = require('../../model/auth.store');
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        user: { id: -1, rut: '12.345.678-9' },
        setAuthData: mockSetAuthData,
      });

      authSyncHandler.reconcile({ id: 999, rut: '12.345.678-9' } as any);

      expect(mockSetAuthData).toHaveBeenCalledWith({ id: 999, rut: '12.345.678-9' });
    });

    it('no actualiza si el rut no coincide', () => {
      const mockSetAuthData = jest.fn();
      const { useAuthStore } = require('../../model/auth.store');
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        user: { id: -1, rut: '12.345.678-9' },
        setAuthData: mockSetAuthData,
      });

      authSyncHandler.reconcile({ id: 999, rut: '98.765.432-1' } as any);

      expect(mockSetAuthData).not.toHaveBeenCalled();
    });

    it('no actualiza si no hay usuario en el store', () => {
      const mockSetAuthData = jest.fn();
      const { useAuthStore } = require('../../model/auth.store');
      (useAuthStore.getState as jest.Mock).mockReturnValue({
        user: null,
        setAuthData: mockSetAuthData,
      });

      authSyncHandler.reconcile({ id: 999, rut: '12.345.678-9' } as any);

      expect(mockSetAuthData).not.toHaveBeenCalled();
    });
  });
});
