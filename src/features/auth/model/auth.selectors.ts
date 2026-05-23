// src/features/auth/model/auth.selectors.ts

import { useAuthStore } from './auth.store';
import { Usuario } from '@entities/usuario';
import { AuthStatus } from './auth.types';

export const useUser = (): Usuario | null => useAuthStore((state) => state.user);
export const useFirebaseToken = (): string | null => useAuthStore((state) => state.firebaseToken);

export const useAuthStatus = (): AuthStatus => useAuthStore((state) => state.status);
export const useIsHydrated = (): boolean => useAuthStore((state) => state.isHydrated);

export const useIsAuthenticated = (): boolean =>
  useAuthStore((state) => state.status === 'authenticated');
export const useIsGuest = (): boolean => useAuthStore((state) => state.status === 'guest');

export const useAuthActions = () =>
  useAuthStore((state) => ({
    setAuthData: state.setAuthData,
    logout: state.logout,
  }));
