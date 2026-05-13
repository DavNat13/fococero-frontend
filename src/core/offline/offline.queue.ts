// src/core/offline/offline.queue.ts

import { outboxStorage } from './storage.client';

export interface OutboxTask {
  id: string;
  url: string;
  method: 'post' | 'put' | 'patch' | 'delete';
  payload: unknown;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'pending_mutations';

/**
 * ============================================================================
 * GESTOR DE LA BANDEJA DE SALIDA (Data Structure Manager)
 * ============================================================================
 * Aísla las operaciones de lectura/escritura de la cola para que el
 * Sincronizador no tenga que lidiar con AsyncStorage directamente.
 */
class OfflineQueueManager {
  // 1. Obtener todas las tareas pendientes
  public async getQueue(): Promise<OutboxTask[]> {
    try {
      const data = await outboxStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[OfflineQueue] Error leyendo la cola:', error);
      return [];
    }
  }

  // 2. Sobrescribir la cola completa
  public async saveQueue(queue: OutboxTask[]): Promise<void> {
    try {
      await outboxStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('[OfflineQueue] Error guardando la cola:', error);
    }
  }

  // 3. Agregar una nueva tarea (Enqueue)
  public async enqueue(
    task: Omit<OutboxTask, 'id' | 'timestamp' | 'retries'>,
  ): Promise<OutboxTask> {
    const queue = await this.getQueue();

    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const newTask: OutboxTask = {
      ...task,
      id: generateUUID(),
      timestamp: Date.now(),
      retries: 0,
    };

    queue.push(newTask);
    await this.saveQueue(queue);

    return newTask;
  }

  // 4. Eliminar una tarea completada (Dequeue)
  public async removeTask(taskId: string): Promise<void> {
    const queue = await this.getQueue();
    const newQueue = queue.filter((task) => task.id !== taskId);
    await this.saveQueue(newQueue);
  }

  // 5. Actualizar una tarea (ej. incrementar contador de reintentos)
  public async updateTask(updatedTask: OutboxTask): Promise<void> {
    const queue = await this.getQueue();
    const index = queue.findIndex((t) => t.id === updatedTask.id);

    if (index !== -1) {
      queue[index] = updatedTask;
      await this.saveQueue(queue);
    }
  }
}

export const offlineQueue = new OfflineQueueManager();
