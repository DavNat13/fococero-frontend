// src/features/auth/offline-strategy/auth.conflict.ts

import { useAuthStore } from '../model/auth.store';

export const authConflictHandler = {
  handleRegistrationFailure: () => {
    const { logout } = useAuthStore.getState();
    logout();
  },
};
