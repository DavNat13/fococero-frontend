// src/features/auth/model/auth.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { secureZustandAdapter, wipeAllStorage } from '@core/offline';
import { Usuario, UserRole } from '@entities/usuario';
import { authApi, LoginCredentials } from '../api/auth.api';
import type { RegisterFullPayload } from '../model/auth.types';

import { tokenUtils } from '../utils/token.utils';
import { AuthState } from './auth.types';

type AuthStore = AuthState & {
  isLoading: boolean;
  error: string | null;
  setAuthData: (user: Usuario, firebaseToken?: string) => void;
  checkSession: () => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterFullPayload) => Promise<boolean>;
  clearError: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      status: 'unauthenticated',
      user: null,
      firebaseToken: null,
      isHydrated: false,
      isLoading: false,
      error: null,

      setHydrated: () => set({ isHydrated: true }),

      setAuthData: (user: Usuario, firebaseToken?: string) => {
        const isGuest = user.rol === UserRole.INVITADO;

        set({
          status: isGuest ? 'guest' : 'authenticated',
          user,
          firebaseToken: firebaseToken ?? null,
          isLoading: false,
          error: null,
        } as AuthState);
      },

      clearError: () => set({ error: null }),

      checkSession: () => {
        const { firebaseToken, status, logout } = get();
        if (status === 'authenticated' && !tokenUtils.isValid(firebaseToken)) {
          logout();
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        const response = await authApi.login(credentials);

        if (response.success && response.data) {
          get().setAuthData(response.data, undefined);
          return true;
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al iniciar sesión' });
          return false;
        }
      },

      register: async (data: RegisterFullPayload) => {
        set({ isLoading: true, error: null });

        const response = await authApi.registerFull(data);

        if (response.success && response.data) {
          get().setAuthData(response.data, data.token);
          return true;
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al registrarse' });
          return false;
        }
      },

      logout: () => {
        set({
          status: 'unauthenticated',
          user: null,
          firebaseToken: null,
          isLoading: false,
          error: null,
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
