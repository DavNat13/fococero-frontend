// src/core/offline/offline.sync.ts

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { apiClient } from '../api';
import { offlineQueue, OutboxTask } from './offline.queue';
import { authSyncHandler, authConflictHandler } from '@features/auth/offline-strategy';

const MAX_RETRIES = 3;

class OfflineSyncOrchestrator {
  private isSyncing = false;
  private unsubscribeNetInfo: (() => void) | null = null;

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

  public async addTask(task: Omit<OutboxTask, 'id' | 'timestamp' | 'retries'>) {
    await offlineQueue.enqueue(task);
    this.attemptSync();
  }

  private handleNetworkChange = (state: NetInfoState) => {
    if (state.isConnected && state.isInternetReachable) {
      this.attemptSync();
    }
  };

  private async attemptSync() {
    if (this.isSyncing) return;

    const queue = await offlineQueue.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;

    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) return;

      for (const task of queue) {
        const result = await this.processTask(task);

        if (result.success) {
          this.handleTaskSuccess(task, result.data);
          await offlineQueue.removeTask(task.id);
        } else {
          await this.handleTaskFailure(task);
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Ejecuta la tarea HTTP dinámica.
   * Retorna Promise<any> para evitar choques de inferencia de TypeScript
   * entre respuestas exitosas y fallos controlados del catch.
   */
  private async processTask(task: OutboxTask): Promise<any> {
    try {
      const config = {
        headers: {
          'X-Outbox-Retry': task.retries.toString(),
          'Idempotency-Key': task.id,
        },
      };

      if (task.method === 'delete') {
        return await apiClient.delete(task.url, { ...config, data: task.payload });
      }

      // Casteo dinámico del método para satisfacer TypeScript
      return await (apiClient as any)[task.method](task.url, task.payload, config);
    } catch {
      return { success: false, error: { code: 'UNKNOWN_ERROR' } };
    }
  }

  private handleTaskSuccess(task: OutboxTask, data: any) {
    if (task.url === '/auth/register-guest') {
      authSyncHandler.reconcile(data.usuario);
    }
  }

  private async handleTaskFailure(task: OutboxTask) {
    if (task.retries < MAX_RETRIES) {
      await offlineQueue.updateTask({ ...task, retries: task.retries + 1 });
    } else {
      if (task.url === '/auth/register-guest') {
        authConflictHandler.handleRegistrationFailure();
      }
      await offlineQueue.removeTask(task.id);
    }
  }
}

export const offlineSync = new OfflineSyncOrchestrator();
