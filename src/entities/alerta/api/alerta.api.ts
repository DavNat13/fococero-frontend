// src/entities/alerta/api/alerta.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';

export interface Alerta {
  id: string;
  tipo: string;
  estado: AlertaEstado;
  latitud: number;
  longitud: number;
  direccion?: string;
  descripcion?: string;
  evidenciaUrl?: string;
  usuarioId: string;
  createdAt: string;
  updatedAt?: string;
}

export type AlertaEstado = 'PENDIENTE' | 'EN_PROCESO' | 'VERIFICADA' | 'RESUELTA' | 'DESCARTADA';

export interface CrearAlertaPayload {
  tipo: string;
  latitud: number;
  longitud: number;
  direccion?: string;
  descripcion?: string;
  evidenciaUrl?: string;
}

export interface CambiarEstadoPayload {
  estado: AlertaEstado;
}

export interface AlertasCercanasParams {
  latitud: number;
  longitud: number;
  radio?: number;
}

export const alertaApi = {
  crear: async (payload: CrearAlertaPayload): Promise<ApiResponse<Alerta>> => {
    return apiClient.post<Alerta>('/api/alertas', payload);
  },

  misAlertas: async (): Promise<ApiResponse<Alerta[]>> => {
    return apiClient.get<Alerta[]>('/api/alertas/mis-alertas');
  },

  cercanas: async (params: AlertasCercanasParams): Promise<ApiResponse<Alerta[]>> => {
    return apiClient.get<Alerta[]>('/api/alertas/cercanas', { params });
  },

  obtenerPorId: async (id: string): Promise<ApiResponse<Alerta>> => {
    return apiClient.get<Alerta>(`/api/alertas/${id}`);
  },

  obtenerTodas: async (): Promise<ApiResponse<Alerta[]>> => {
    return apiClient.get<Alerta[]>('/api/alertas');
  },

  verificar: async (id: string): Promise<ApiResponse<Alerta>> => {
    return apiClient.post<Alerta>(`/api/alertas/${id}/verificar`);
  },

  cambiarEstado: async (id: string, payload: CambiarEstadoPayload): Promise<ApiResponse<Alerta>> => {
    return apiClient.patch<Alerta>(`/api/alertas/${id}/estado`, payload);
  },

  eliminar: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/alertas/${id}`);
  },
};