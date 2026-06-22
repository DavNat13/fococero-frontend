// src/features/auth/offline-strategy/__tests__/auth.conflict.test.ts

jest.mock('../../model/auth.store', () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

import { authConflictHandler } from '../auth.conflict';

describe('authConflictHandler', () => {
  describe('handleRegistrationFailure', () => {
    it('llama logout cuando falla el registro offline', () => {
      const mockLogout = jest.fn();
      const { useAuthStore } = require('../../model/auth.store');
      (useAuthStore.getState as jest.Mock).mockReturnValue({ logout: mockLogout });

      authConflictHandler.handleRegistrationFailure();

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});
