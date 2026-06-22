// src/features/auth/model/auth.types.ts
import { Usuario, Rut } from '@entities/usuario';

// 1. BRANDED TYPES (Tipos Nominales exclusivos de Auth)
export type FirebaseUid = string & { readonly __brand: 'FirebaseUid' };

// 2. CONTRATOS DE ESTADO FINITO (DISCRIMINATED UNIONS)

export type AuthStatus = 'loading' | 'unauthenticated' | 'guest' | 'authenticated';

export interface BaseAuthState {
  status: AuthStatus;
  isHydrated: boolean;
  setHydrated: () => void;
  logout: () => void;
}

// Si no está logueado, TypeScript PROHÍBE acceder a 'user'
export interface UnauthenticatedState extends BaseAuthState {
  status: 'unauthenticated' | 'loading';
  user: null;
  firebaseToken: null;
}

// Si es invitado o autenticado, TypeScript GARANTIZA que 'user' existe
export interface AuthenticatedState extends BaseAuthState {
  status: 'guest' | 'authenticated';
  user: Usuario; // ✨ Consumiendo la Entidad
  firebaseToken: string | null; 
}

export type AuthState = UnauthenticatedState | AuthenticatedState;

// 3. CONTRATOS DE RED (Payloads para la API)

export interface RegisterGuestPayload {
  rut: Rut; 
  nombre: string;
  apellido: string;
  telefono: string;
}

export interface RegisterFullPayload extends RegisterGuestPayload {
  token: string; // El ID Token de Firebase
}