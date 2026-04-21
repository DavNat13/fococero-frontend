// src/features/auth/model/auth.types.ts

// ============================================================================
// 1. BRANDED TYPES (Tipos Nominales)
// ============================================================================
// Evita que pasemos un string de "telefono" a una función que pide un "Rut".
// En tiempo de ejecución son solo strings, pero el compilador los trata como tipos únicos.

export type Rut = string & { readonly __brand: 'Rut' };
export type FirebaseUid = string & { readonly __brand: 'FirebaseUid' };

// ============================================================================
// 2. ENUMERADORES DE DOMINIO (Sincronizados con ms-auth)
// ============================================================================

export enum UserRole {
  INVITADO = 'invitado',
  USUARIO = 'usuario',
  BRIGADISTA = 'brigadista',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVO = 'activo',
  BLOQUEADO = 'bloqueado',
  SUSPENDIDO = 'suspendido',
}

// ============================================================================
// 3. ENTIDADES PRINCIPALES
// ============================================================================

export interface Usuario {
  id: number;
  rut: Rut;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string | null;
  rol: UserRole;
  estado: UserStatus;
  fcmToken: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 4. CONTRATOS DE ESTADO FINITO (DISCRIMINATED UNIONS)
// ============================================================================
// Esto hace MATEMÁTICAMENTE IMPOSIBLE tener un usuario logueado pero sin datos.

type AuthStatus = 'loading' | 'unauthenticated' | 'guest' | 'authenticated';

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
  user: Usuario;
  firebaseToken: string | null; // El invitado no tiene token de firebase
}

// La unión que usará Zustand
export type AuthState = UnauthenticatedState | AuthenticatedState;

// ============================================================================
// 5. CONTRATOS DE RED (Payloads para la API)
// ============================================================================

export interface RegisterGuestPayload {
  rut: Rut; // Garantiza matemáticamente que el RUT está limpio y validado
  nombre: string;
  apellido: string;
  telefono: string;
}

export interface RegisterFullPayload extends RegisterGuestPayload {
  token: string; // El ID Token de Firebase
}
