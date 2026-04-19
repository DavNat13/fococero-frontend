// src/core/api/index.ts

/**
 * @module core/api
 * @description
 * Capa de Red y Comunicación HTTP de FocoCero.
 * * ============================================================================
 * REGLAS ARQUITECTÓNICAS (FACADE PATTERN):
 * ============================================================================
 * 1. La UI y las Features NUNCA deben importar 'axios' directamente.
 * 2. Todo consumo de red debe hacerse a través de `apiClient`.
 * 3. Todo error de red se evalúa contra la clase `ApiError`.
 * * Esta fachada oculta la complejidad de los interceptores, el Mutex de
 * tokens y la estandarización de errores del resto de la aplicación.
 */

// ----------------------------------------------------------------------------
// 1. EXPORTACIONES DE VALOR (Código que se ejecuta en el dispositivo)
// ----------------------------------------------------------------------------

export { apiClient } from './api.client';
export { ApiError } from './api.errors';

// ----------------------------------------------------------------------------
// 2. EXPORTACIONES DE TIPO (Código estático para el compilador / Tree-Shaken)
// ----------------------------------------------------------------------------
// Se usa 'export type' para garantizar que estas importaciones tengan un
// impacto de 0 bytes en el peso final (bundle) de la aplicación.

export type {
  // Contratos de Respuesta
  ApiResponse,
  ApiSuccess,
  ApiFailure,
  PaginatedResponse,
  PaginatedData,
  PaginationParams,

  // Contratos de Errores
  AppErrorCode,
  ApiErrorDetail,

  // Branded Types (Identificadores Nominales)
  UsuarioId,
  FocoIncendioId,
  ReporteId,
} from './api.types';
