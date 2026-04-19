// src/core/offline/offline.sync.ts

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { apiClient } from '../api';
import { offlineQueue, OutboxTask } from './offline.queue';

const MAX_RETRIES = 3;

/**
 * ============================================================================
 * ORQUESTADOR DE RED (Sync Daemon)
 * ============================================================================
 * Se encarga exclusivamente de observar la conexión a internet y
 * vaciar la bandeja de salida (offlineQueue) sin bloquear la UI.
 */
class OfflineSyncOrchestrator {
  private isSyncing = false;
  private unsubscribeNetInfo: (() => void) | null = null;

  // 1. CICLO DE VIDA
  public init() {
    if (this.unsubscribeNetInfo) return;
    this.unsubscribeNetInfo = NetInfo.addEventListener(this.handleNetworkChange);
  }

  public destroy() {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
      this.unsubscribeNetInfo = null;
    }
  }

  // 2. INTERFAZ PÚBLICA PARA UI/ZUSTAND
  public async addTask(task: Omit<OutboxTask, 'id' | 'timestamp' | 'retries'>) {
    // Delegamos la persistencia estructural a la Cola
    await offlineQueue.enqueue(task);

    // Intentamos sincronizar inmediatamente por si hay red
    this.attemptSync();
  }

  // 3. ORQUESTACIÓN INTERNA
  private handleNetworkChange = (state: NetInfoState) => {
    if (state.isConnected && state.isInternetReachable) {
      this.attemptSync();
    }
  };

  private async attemptSync() {
    // Mutex: Previene ejecuciones paralelas si la red parpadea
    if (this.isSyncing) return;

    const queue = await offlineQueue.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;

    try {
      // Doble verificación del estado real de la red
      const state = await NetInfo.fetch();
      if (!state.isConnected) return;

      // Procesamiento secuencial
      for (const task of queue) {
        const success = await this.processTask(task);

        if (success) {
          await offlineQueue.removeTask(task.id);
        } else {
          if (task.retries < MAX_RETRIES) {
            await offlineQueue.updateTask({ ...task, retries: task.retries + 1 });
          } else {
            // Dead Letter Protocol: Superó reintentos, se descarta para no bloquear la cola
            await offlineQueue.removeTask(task.id);
            console.warn(
              `[OfflineSync] Tarea ${task.id} descartada tras ${MAX_RETRIES} intentos fallidos.`,
            );
          }
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private async processTask(task: OutboxTask): Promise<boolean> {
    try {
      const config = {
        headers: {
          'X-Outbox-Retry': task.retries.toString(),
          'Idempotency-Key': task.id,
        },
      };

      let response;

      // Separación de firmas para TypeScript estricto
      if (task.method === 'delete') {
        response = await apiClient.delete(task.url, {
          ...config,
          data: task.payload,
        });
      } else {
        response = await apiClient[task.method](task.url, task.payload, config);
      }

      return response.success;
    } catch {
      return false;
    }
  }
}

// Exportamos una instancia Singleton
export const offlineSync = new OfflineSyncOrchestrator();
