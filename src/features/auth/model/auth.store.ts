// src/features/auth/model/auth.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { secureZustandAdapter, wipeAllStorage } from '@core/offline';
import { Usuario, UserRole } from '@entities/usuario';

import { tokenUtils } from '../utils/token.utils';
import { AuthState } from './auth.types';

type AuthStore = AuthState & {
  setAuthData: (user: Usuario, firebaseToken?: string) => void;
  checkSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      status: 'unauthenticated',
      user: null,
      firebaseToken: null,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      setAuthData: (user: Usuario, firebaseToken?: string) => {
        const isGuest = user.rol === UserRole.INVITADO;

        set({
          status: isGuest ? 'guest' : 'authenticated',
          user,
          firebaseToken: firebaseToken ?? null,
        } as AuthState);
      },

      checkSession: () => {
        const { firebaseToken, status, logout } = get();
        if (status === 'authenticated' && !tokenUtils.isValid(firebaseToken)) {
          logout();
        }
      },

      logout: () => {
        set({
          status: 'unauthenticated',
          user: null,
          firebaseToken: null,
        } as AuthState);
        wipeAllStorage();
      },
    }),
    {
      name: 'fococero-auth-session',
      storage: secureZustandAdapter,
      partialize: (state) => ({
        status: state.status,
        user: state.user,
        firebaseToken: state.firebaseToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (state.firebaseToken && !tokenUtils.isValid(state.firebaseToken)) {
          state.logout();
        }

        state.setHydrated();
      },
    },
  ),
);
