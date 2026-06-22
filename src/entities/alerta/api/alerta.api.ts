import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';

export type AlertaEstado = 'REPORTADA' | 'EN_REVISION' | 'DERIVADA' | 'RESUELTA' | 'DESCARTADA';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface Alerta {
  id?: string;
  foco_id?: string | null;
  usuario_id: string;
  tipo: string;
  gravedad?: string;
  estado?: AlertaEstado;
  descripcion: string;
  imagenes?: string[];
  ubicacion: GeoPoint;
  metadata?: any;
  fecha_creacion?: string;
}

export interface CrearAlertaPayload {
  foco_id?: string | null;
  tipo: string;
  gravedad: string;
  descripcion: string;
  ubicacion: GeoPoint;
  imagenes?: string[];
}

export interface CambiarEstadoPayload {
  estado: AlertaEstado;
}

export interface AlertasCercanasParams {
  lng: number;
  lat: number;
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

  alertasPublicas: async (): Promise<ApiResponse<Alerta[]>> => {
    return apiClient.get<Alerta[]>('/api/alertas/publicas');
  },

  obtenerTodas: async (): Promise<ApiResponse<Alerta[]>> => {
    return apiClient.get<Alerta[]>('/api/alertas');
  },

  verificar: async (id: string, esFuegoConfirmado?: boolean): Promise<ApiResponse<Alerta>> => {
    return apiClient.post<Alerta>(`/api/alertas/${id}/verificar`, { esFuegoConfirmado });
  },

  cambiarEstado: async (
    id: string,
    payload: CambiarEstadoPayload,
  ): Promise<ApiResponse<Alerta>> => {
    return apiClient.patch<Alerta>(`/api/alertas/${id}/estado`, payload);
  },

  eliminar: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/alertas/${id}`);
  },
};
