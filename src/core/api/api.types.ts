// src/core/api/api.types.ts

/**
 * ============================================================================
 * CONTRATOS DE RED (NIVEL STAFF / PRINCIPAL ENGINEER)
 * ============================================================================
 */

// 1. BRANDED TYPES (Tipado Opaco / Nominal Typing)
export type Brand<K, T> = K & { readonly __brand: T };

export type UsuarioId = Brand<string, 'UsuarioId'>;
export type FocoIncendioId = Brand<string, 'FocoIncendioId'>;
export type ReporteId = Brand<string, 'ReporteId'>;

// 2. DISCRIMINATED UNIONS (Patrón Result)
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: ApiMetadata;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

// 3. OBSERVABILIDAD Y TELEMETRÍA AVANZADA
export interface ApiMetadata {
  timestamp: string;
  requestId: string; // UUID de la petición (Vital para buscar en logs de Datadog/Sentry)
  executionTimeMs: number; // Rendimiento del backend
  rateLimit?: {
    // Previene que la app colapse si el usuario hace spam
    limit: number;
    remaining: number;
    resetAt: string;
  };
}

// 4. DICCIONARIO ESTRICTO DE ERRORES DE NEGOCIO
export type AppErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'OFFLINE_SYNC_PENDING'
  | 'CONTRACT_BREACH';

export interface ApiErrorDetail {
  code: AppErrorCode;
  message: string;
  // Mapeo estricto para errores de formulario (ej: { email: ["El email es inválido"] })
  validationErrors?: Record<string, string[]>;
}

// 5. PAGINACIÓN INMUTABLE
export interface PaginatedData<T> {
  // ReadonlyArray evita que alguien haga un .push() mutando la caché global por accidente
  readonly items: readonly T[];
  readonly pagination: {
    readonly totalItems: number;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
  };
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

// 6. UTILIDADES DE PETICIÓN (Utility Types)
// Parámetros flexibles pero tipados para enviar en la URL
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
