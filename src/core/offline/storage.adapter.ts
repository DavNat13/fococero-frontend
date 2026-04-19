// src/core/offline/storage.adapter.ts

import { StateStorage, createJSONStorage } from 'zustand/middleware';
import { globalStorage, secureStorage, outboxStorage } from './storage.client';

type StorageClient = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

// ============================================================================
// ENVOLTORIO DE RESILIENCIA EXTREMA (L1/L2 CACHE PATTERN)
// ============================================================================

const createSafeStorage = (storage: StorageClient, partitionName: string): StateStorage => {
  // L1 Cache: Bóveda de contingencia en Memoria RAM (Event Loop)
  const fallbackMemory = new Map<string, string>();

  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        const diskValue = await storage.getItem(name);
        // Si el dato no está en disco, revisamos si nuestro salvavidas lo tiene
        return diskValue !== null ? diskValue : fallbackMemory.get(name) || null;
      } catch (error) {
        // Observabilidad silenciosa: Mandar a Sentry/Datadog en el futuro
        console.warn(`[Storage:${partitionName}] Disco inaccesible. Leyendo desde RAM.`, error);
        return fallbackMemory.get(name) || null;
      }
    },

    setItem: async (name: string, value: string): Promise<void> => {
      try {
        await storage.setItem(name, value);
        // Mantenemos consistencia: Si el disco funciona, la RAM también se actualiza
        fallbackMemory.set(name, value);
      } catch (error) {
        console.error(
          `[Storage:${partitionName}] Fallo físico (¿Disco lleno?). Salvando en RAM.`,
          error,
        );
        // SUPERVIVENCIA: Si el hardware rechaza la escritura, el dato sobrevive aquí
        fallbackMemory.set(name, value);
      }
    },

    removeItem: async (name: string): Promise<void> => {
      try {
        await storage.removeItem(name);
      } catch (error) {
        console.warn(`[Storage:${partitionName}] Fallo al eliminar en disco.`, error);
      } finally {
        // CRÍTICO: Siempre borrar de RAM para evitar Fugas de Memoria (Memory Leaks)
        fallbackMemory.delete(name);
      }
    },
  };
};

// ============================================================================
// ADAPTADORES EXPORTADOS (INYECCIÓN LISTA PARA ZUSTAND)
// ============================================================================

export const globalZustandAdapter = createJSONStorage(() =>
  createSafeStorage(globalStorage, 'GlobalPartition'),
);

export const secureZustandAdapter = createJSONStorage(() =>
  createSafeStorage(secureStorage, 'SecurePartition'),
);

export const outboxZustandAdapter = createJSONStorage(() =>
  createSafeStorage(outboxStorage, 'OutboxPartition'),
);
