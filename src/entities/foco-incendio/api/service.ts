// src/entities/foco-incendio/api/service.ts
import { apiClient } from '@/core/api/api.client';
import type {
    AlertaIncendio,
    CambiarEstadoAlertaDTO,
    CrearAlertaDTO
} from '../model/types';

const BASE_URL = '/api/alertas';

// --- LECTURA (Ya los tenías, actualizados con la lógica de éxito) ---
export const getFocos = async (): Promise<AlertaIncendio[]> => {
  const response = await apiClient.get<AlertaIncendio[]>(BASE_URL);
  if (!response.success) throw new Error(response.error.message);
  return response.data;
};

// --- ESCRITURA (Nuevas funciones) ---

/**
 * Crea una nueva alerta de incendio (ms-alertas)
 * Requiere descripción (min 10 caracteres) y ubicación GeoJSON
 */
export const crearFoco = async (data: CrearAlertaDTO): Promise<AlertaIncendio> => {
  const response = await apiClient.post<AlertaIncendio>(BASE_URL, data);
  if (!response.success) throw new Error(response.error.message);
  return response.data;
};

/**
 * Actualiza el estado operativo de una alerta (ej: de REPORTADA a EN_REVISION)
 * Endpoint: PATCH /api/alertas/{id}/estado
 */
export const actualizarEstadoFoco = async (
  id: string,
  data: CambiarEstadoAlertaDTO
): Promise<AlertaIncendio> => {
  const response = await apiClient.patch<AlertaIncendio>(`${BASE_URL}/${id}/estado`, data);
  if (!response.success) throw new Error(response.error.message);
  return response.data;
};

/**
 * Realiza un borrado lógico de la alerta.
 * Solo disponible para roles Administrativos según Swagger
 */
export const eliminarFoco = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`${BASE_URL}/${id}`);
  if (!response.success) throw new Error(response.error.message);
};
