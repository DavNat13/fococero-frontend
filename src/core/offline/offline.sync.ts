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

      const CONCURRENCY_LIMIT = 3;
      const chunks = [];
      for (let i = 0; i < queue.length; i += CONCURRENCY_LIMIT) {
        chunks.push(queue.slice(i, i + CONCURRENCY_LIMIT));
      }

      const results: PromiseSettledResult<any>[] = [];
      for (const chunk of chunks) {
        const chunkResults = await Promise.allSettled(chunk.map((task) => this.processTask(task)));
        results.push(...chunkResults);
      }

      for (let i = 0; i < queue.length; i++) {
        const task = queue[i];
        const result = results[i];

        if (result.status === 'fulfilled' && result.value?.success) {
          this.handleTaskSuccess(task, result.value.data);
          await offlineQueue.removeTask(task.id);
        } else {
          await this.handleTaskFailure(task);
        }
      }

      for (let i = 0; i < queue.length; i++) {
        const task = queue[i];
        const result = results[i];

        if (result.status === 'fulfilled' && result.value?.success) {
          this.handleTaskSuccess(task, result.value.data);
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

      const methods: Record<
        string,
        (url: string, data?: unknown, config?: object) => Promise<unknown>
      > = {
        post: (url, data, cfg) => apiClient.post(url, data, cfg),
        put: (url, data, cfg) => apiClient.put(url, data, cfg),
        patch: (url, data, cfg) => apiClient.patch(url, data, cfg),
        delete: (url, data, cfg) => apiClient.delete(url, { ...cfg, data }),
      };
      const methodFn = methods[task.method];
      if (!methodFn) {
        throw new Error(`OfflineSync: método desconocido ${task.method}`);
      }
      return await methodFn(task.url, task.payload, config);
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
