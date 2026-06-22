// src/features/auth/model/auth.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { secureZustandAdapter, wipeAllStorage } from '@core/offline';
import { Usuario } from '@entities/usuario';
import { authApi, LoginCredentials } from '../api/auth.api';
import type { RegisterGuestPayload } from '../model/auth.types';

import { tokenUtils } from '../utils/token.utils';
import { AuthState } from './auth.types';

import { signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirebaseAuth } from '@core/config/firebase.config';

type AuthStore = AuthState & {
  isLoading: boolean;
  error: string | null;
  setAuthData: (user: Usuario, firebaseToken?: string, status?: 'authenticated' | 'guest') => void;
  checkSession: () => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterGuestPayload) => Promise<boolean>;
  refreshGuestToken: () => Promise<void>;
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

      setAuthData: (user: Usuario, firebaseToken?: string, status?: 'authenticated' | 'guest') => {
        set({
          status: status ?? ('authenticated' as const),
          user,
          firebaseToken: firebaseToken ?? null,
          isLoading: false,
          error: null,
          isHydrated: true,
        });
      },

      clearError: () => set({ error: null }),

      checkSession: () => {
        const { firebaseToken, status, logout } = get();
        if (status === 'authenticated' && !tokenUtils.isValid(firebaseToken)) {
          logout();
        }
      },

      refreshGuestToken: async () => {
        try {
          const auth = getFirebaseAuth();
          const currentUser = auth.currentUser;
          if (!currentUser) {
            const credential = await signInAnonymously(auth);
            const newToken = await credential.user.getIdToken();
            set({ firebaseToken: newToken });
          } else {
            const newToken = await currentUser.getIdToken(true);
            set({ firebaseToken: newToken });
          }
        } catch {
          const isDev =
            typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';
          if (isDev) console.warn('[Auth] No se pudo refrescar token anónimo');
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // 1. Llamar al backend para obtener credenciales + firebaseToken
          const response = await authApi.login(credentials);

          if (!response.success) {
            const errorMsg = response.error?.message || 'Error al iniciar sesión';
            set({ isLoading: false, error: errorMsg });
            return false;
          }

          // 2. Extraer usuario y firebaseToken de la respuesta del backend
          const { usuario, firebaseToken } = response.data;

          // 3. Autenticar en Firebase usando el custom token emitido por el backend
          const auth = getFirebaseAuth();
          const userCredential = await signInWithCustomToken(auth, firebaseToken);

          // 4. Obtener el ID token real (el custom token no sirve para verifyIdToken)
          const freshIdToken = await userCredential.user.getIdToken();

          // 5. Actualizar store con el usuario real y el ID token real
          get().setAuthData(usuario, freshIdToken);
          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Error inesperado al iniciar sesión';
          const isDev =
            typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';
          if (isDev) console.error('[Auth] Error en login:', error);
          set({ isLoading: false, error: message });
          return false;
        }
      },

      register: async (data: RegisterGuestPayload) => {
        set({ isLoading: true, error: null });

        try {
          // 1. Obtener identidad anónima de Firebase (necesaria para firebase_uid)
          const auth = getFirebaseAuth();
          const credential = await signInAnonymously(auth);
          const anonymousToken = await credential.user.getIdToken();
          const firebaseUid = credential.user.uid;

          // 2. Preparar payload incluyendo password si fue proporcionado
          const payload: RegisterGuestPayload = {
            ...data,
            firebase_uid: firebaseUid,
          };

          // 3. Llamar al backend para registrar al invitado
          const response = await authApi.registerGuest(payload);

          if (!response.success) {
            const errorMessage = response.error?.message || 'Error al registrarse';
            set({ isLoading: false, error: errorMessage });
            return false;
          }

          // 4. Extraer usuario y firebaseToken de la respuesta
          const { usuario, firebaseToken } = response.data;

          // 5. Si el backend devolvió un firebaseToken, auto-loguear con él
          if (firebaseToken) {
            const credential = await signInWithCustomToken(auth, firebaseToken);
            const freshIdToken = await credential.user.getIdToken();
            get().setAuthData(usuario, freshIdToken, 'guest');
          } else {
            // 6. Sin token del backend, mantener el token anónimo
            get().setAuthData(usuario, anonymousToken, 'guest');
          }
          return true;
        } catch (error) {
          const isDev =
            typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';
          if (isDev) console.error('[Auth] Error en register:', error);
          const message =
            error instanceof Error
              ? error.message
              : 'No pudimos completar el registro. Verifica tu conexión a internet.';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      logout: async () => {
        try {
          set({
            status: 'unauthenticated' as const,
            user: null,
            firebaseToken: null,
            isLoading: false,
            error: null,
          });
          await wipeAllStorage();
        } catch (error) {
          const isDev =
            typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';
          if (isDev) console.error('[Auth] Error en logout:', error);
        }
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

        if (
          (state.status === 'authenticated' || state.status === 'guest') &&
          state.firebaseToken &&
          !tokenUtils.isValid(state.firebaseToken)
        ) {
          Object.assign(state, { status: 'unauthenticated', user: null, firebaseToken: null });
        }

        state.setHydrated();
      },
    },
  ),
);
