// src/features/foco-incendio/api/foco-incendio.api.ts
import { apiClient } from '@/core/api/api.client';
import type {
  CrearAlertaDTO,
  VerificarAlertaDTO,
  AlertaIncendio,
} from '@/entities/foco-incendio/model/types';

const BASE_URL = '/api/alertas';

/**
 * Caso de Uso Feature: Verificación en Terreno (Rol Brigadista)
 * A diferencia de un simple PATCH de estado, esta acción confirma
 * operativa y legalmente la existencia del fuego en el sistema.
 */
export const verificarFocoEnTerreno = async (
  id: string,
  payload: VerificarAlertaDTO,
): Promise<AlertaIncendio> => {
  // Endpoint específico extraído de la definición de tu DTO
  const response = await apiClient.post<AlertaIncendio>(`${BASE_URL}/${id}/verificar`, payload);

  if (!response.success) {
    throw new Error(`Error en la verificación: ${response.error.message}`);
  }

  return response.data;
};

/**
 * Caso de Uso Feature: Sincronización Batch (Offline -> Online)
 * En lugar de enviar la cola de a uno en un loop for (que puede saturar el Gateway),
 * idealmente enviamos un payload estructurado si el backend lo soporta,
 * o hacemos una Promise.all controlada.
 */
export const sincronizarAlertasBatch = async (
  alertasEncoladas: CrearAlertaDTO[],
): Promise<{ exitosas: number; fallidas: number }> => {
  // Nota Arquitectónica: Si el API Gateway tiene un endpoint /batch, se usa ese.
  // Aquí simularemos una ejecución en paralelo controlada (Promise.allSettled)
  // para evitar que una petición fallida detenga toda la sincronización.

  const promesas = alertasEncoladas.map((alerta) =>
    apiClient.post<AlertaIncendio>(BASE_URL, alerta),
  );

  const resultados = await Promise.allSettled(promesas);

  const metricas = { exitosas: 0, fallidas: 0 };

  resultados.forEach((resultado) => {
    if (resultado.status === 'fulfilled' && resultado.value.success) {
      metricas.exitosas++;
    } else {
      metricas.fallidas++;
    }
  });

  return metricas;
};
