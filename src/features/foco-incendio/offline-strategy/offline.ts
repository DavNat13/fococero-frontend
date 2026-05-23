// src/features/foco-incendio/offline-strategy/foco-incendio.offline.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CrearAlertaDTO } from '@/entities/foco-incendio/model/types';

const OFFLINE_QUEUE_KEY = '@fococero_offline_queue_alertas';

export interface QueuedAlerta {
  id_temporal: string;
  data: CrearAlertaDTO;
  timestamp: number;
}

/**
 * Encola una petición de creación de foco cuando no hay internet.
 * Implementa el patrón Outbox ligero en cliente.
 */
export const encolarAlertaOffline = async (alerta: CrearAlertaDTO): Promise<void> => {
  try {
    const queueStr = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    const queue: QueuedAlerta[] = queueStr ? JSON.parse(queueStr) : [];

    const nuevaPeticion: QueuedAlerta = {
      id_temporal: `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      data: alerta,
      timestamp: Date.now(),
    };

    queue.push(nuevaPeticion);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    console.warn(`[Offline Strategy] Alerta encolada localmente. Total en cola: ${queue.length}`);
  } catch (error) {
    console.error('[Offline Strategy] Error al encolar alerta:', error);
    throw new Error('Fallo crítico al guardar la alerta localmente.');
  }
};

/**
 * Obtiene la cola actual (para ser procesada por un Worker o el SyncHandler cuando vuelva la conexión)
 */
export const obtenerColaAlertas = async (): Promise<QueuedAlerta[]> => {
  const queueStr = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  return queueStr ? JSON.parse(queueStr) : [];
};
