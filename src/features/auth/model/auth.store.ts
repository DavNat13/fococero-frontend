// src/features/auth/model/auth.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { secureZustandAdapter, wipeAllStorage } from '@core/offline';
import { Usuario } from '@entities/usuario';
import { authApi, LoginCredentials } from '../api/auth.api';
import type { RegisterGuestPayload } from '../model/auth.types';

import { tokenUtils } from '../utils/token.utils';
import { AuthState } from './auth.types';

type AuthStore = AuthState & {
  isLoading: boolean;
  error: string | null;
  setAuthData: (user: Usuario, firebaseToken?: string) => void;
  checkSession: () => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterGuestPayload) => Promise<boolean>;
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
        set({
          status: 'authenticated' as const,
          user,
          firebaseToken: firebaseToken ?? null,
          isLoading: false,
          error: null,
          isHydrated: true,
          setHydrated: get().setHydrated,
          logout: get().logout,
        });
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

        if (response.success) {
          get().setAuthData(response.data, undefined);
          return true;
        }
        
        set({ isLoading: false, error: 'Error al iniciar sesión' });
        return false;
      },

      register: async (data: RegisterGuestPayload) => {
        set({ isLoading: true, error: null });

        const response = await authApi.registerGuest(data);

        if (response.success) {
          get().setAuthData(response.data, undefined);
          return true;
        }
        
        // Mostrar el error específico del backend
        const errorMessage = response.error?.message || 'Error al registrarse';
        set({ isLoading: false, error: errorMessage });
        return false;
      },

      logout: () => {
        set({
          status: 'unauthenticated' as const,
          user: null,
          firebaseToken: null,
          isLoading: false,
          error: null,
        });
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
