// src/features/auth/offline-strategy/auth.sync-handler.ts

import { useAuthStore } from '../model/auth.store';
import { Usuario } from '@entities/usuario';

export const authSyncHandler = {
  reconcile: (serverUser: Usuario) => {
    const { user, setAuthData } = useAuthStore.getState();

    if (user && (user.id ?? 0) < 0 && user.rut === serverUser.rut) {
      setAuthData(serverUser);
    }
  },
};
