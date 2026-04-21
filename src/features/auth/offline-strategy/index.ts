// src/features/auth/offline-strategy/index.ts

/**
 * ============================================================================
 * FACHADA DE ESTRATEGIA OFFLINE (AUTH)
 * ============================================================================
 * Exporta exclusivamente los manejadores activos para mantener un
 * contrato limpio con el resto de la aplicación y evitar dependencias rotas.
 */

export { authOfflineStrategy } from './auth.offline';
export { authSyncHandler } from './auth.sync-handler';
export { authConflictHandler } from './auth.conflict';
