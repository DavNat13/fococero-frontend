// src/core/offline/index.ts

/**
 * ============================================================================
 * MÓDULO DE PERSISTENCIA Y RESILIENCIA (OFFLINE CORE)
 * ============================================================================
 * Este archivo centraliza y exporta la infraestructura necesaria para que
 * FocoCero funcione sin conexión, gestionando el almacenamiento físico,
 * los adaptadores de estado global y la sincronización en segundo plano.
 */

// 1. MOTORES Y UTILIDADES DE LIMPIEZA
export { wipeAllStorage } from './storage.client';

// 2. ADAPTADORES PARA ZUSTAND
export {
  globalZustandAdapter,
  secureZustandAdapter,
  outboxZustandAdapter,
} from './storage.adapter';

// 3. ORQUESTACIÓN DE LA BANDEJA DE SALIDA (OUTBOX)
export { offlineSync } from './offline.sync';
export { offlineQueue } from './offline.queue';

// 4. CONTRATOS Y TIPOS
export type { OutboxTask } from './offline.queue';
