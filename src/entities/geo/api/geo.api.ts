// src/entities/geo/api/geo.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';

export interface GeoFoco {
  id: string;
  tipo: GeoFocoTipo;
  estado: GeoFocoEstado;
  ubicacion: GeoPoint;
  radio?: number;
  perimetro?: GeoPolygon;
  gravedad?: string;
  descripcion?: string;
  evidenciaUrl?: string;
  usuarioId: string;
  createdAt: string;
  updatedAt?: string;
}

export type GeoFocoTipo = 'INCENDIO' | 'MICROBASURAL' | 'VEGETACION_SECA' | 'OTRO';
export type GeoFocoEstado = 'REPORTADO' | 'CONFIRMADO' | 'CONTENIDO' | 'EXTINGUIDO' | 'DESCARTADO';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitud, latitud]
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface CrearFocoPayload {
  tipo: GeoFocoTipo;
  latitud: number;
  longitud: number;
  radio?: number;
  gravedad?: string;
  descripcion?: string;
  evidenciaUrl?: string;
}

export interface ActualizarFocoPayload {
  tipo?: GeoFocoTipo;
  latitud?: number;
  longitud?: number;
  radio?: number;
  gravedad?: string;
  descripcion?: string;
  evidenciaUrl?: string;
}

export interface CambiarEstadoPayload {
  estado: GeoFocoEstado;
}

export interface ActualizarPerimetroPayload {
  perimetro: GeoPolygon;
}

export interface FocosCercanosParams {
  latitud: number;
  longitud: number;
  radio?: number;
}

export const geoApi = {
  // Zona pública / ciudadana
  reportarFoco: async (payload: CrearFocoPayload): Promise<ApiResponse<GeoFoco>> => {
    return apiClient.post<GeoFoco>('/api/geo', payload);
  },

  obtenerTodos: async (): Promise<ApiResponse<GeoFoco[]>> => {
    return apiClient.get<GeoFoco[]>('/api/geo');
  },

  obtenerCercanos: async (params: FocosCercanosParams): Promise<ApiResponse<GeoFoco[]>> => {
    return apiClient.get<GeoFoco[]>('/api/geo/cercanos', { params });
  },

  obtenerPorId: async (id: string): Promise<ApiResponse<GeoFoco>> => {
    return apiClient.get<GeoFoco>(`/api/geo/${id}`);
  },

  // Zona operativa (ADMIN/BRIGADISTA)
  cambiarEstado: async (id: string, payload: CambiarEstadoPayload): Promise<ApiResponse<GeoFoco>> => {
    return apiClient.patch<GeoFoco>(`/api/geo/${id}/estado`, payload);
  },

  actualizarPerimetro: async (id: string, payload: ActualizarPerimetroPayload): Promise<ApiResponse<GeoFoco>> => {
    return apiClient.patch<GeoFoco>(`/api/geo/${id}/perimetro`, payload);
  },

  actualizarCompleto: async (id: string, payload: ActualizarFocoPayload): Promise<ApiResponse<GeoFoco>> => {
    return apiClient.put<GeoFoco>(`/api/geo/${id}`, payload);
  },

  eliminar: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/geo/${id}`);
  },
};