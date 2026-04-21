// src/features/auth/model/auth.selectors.ts

import { useAuthStore } from './auth.store';

// SELECTORES DE ESTADO (Atómicos)
// Al devolver primitivos o referencias exactas, Zustand memoiza el resultado.

// Datos
export const useUser = () => useAuthStore((state) => state.user);
export const useFirebaseToken = () => useAuthStore((state) => state.firebaseToken);

// Banderas de Flujo
export const useAuthStatus = () => useAuthStore((state) => state.status);
export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);

// Propiedades Computadas (Calculadas al vuelo, ultra rápidas)
export const useIsAuthenticated = () => useAuthStore((state) => state.status === 'authenticated');
export const useIsGuest = () => useAuthStore( ( state ) => state.status === 'guest' );

// SELECTORES DE ACCIONES
// Al devolver funciones, Zustand no memoiza, pero como las funciones son estables (no se re-crean en cada render), no hay problema de rendimiento.
export const useAuthActions = () =>
  useAuthStore((state) => ({
    setAuthData: state.setAuthData,
    logout: state.logout,
  }));
