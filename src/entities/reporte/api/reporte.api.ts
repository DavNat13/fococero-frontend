// src/entities/reporte/api/reporte.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  categoria_id: string;
  categoria_nombre?: string;
  estado: ReporteEstado;
  latitud: number;
  longitud: number;
  direccion?: string;
  usuario_id: string;
  evidencia_urls?: string[];
  created_at: string;
  updated_at?: string;
}

export type ReporteEstado = 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'FALSA_ALARMA';

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  nivel_prioridad?: number;
  activo?: boolean;
}

export interface CrearReportePayload {
  titulo: string;
  descripcion: string;
  categoria_id: string;
  latitud: number;
  longitud: number;
  direccion?: string;
}

export interface ActualizarReportePayload {
  titulo?: string;
  descripcion?: string;
  categoria_id?: string;
  latitud?: number;
  longitud?: number;
  direccion?: string;
}

export interface CambiarEstadoPayload {
  nuevoEstado: ReporteEstado;
  comentarios?: string;
}

export interface HistorialEntry {
  id: string;
  reporte_id: string;
  estado_anterior: ReporteEstado;
  estado_nuevo: ReporteEstado;
  comentario?: string;
  usuario_id: string;
  usuario_nombre?: string;
  timestamp: string;
}

export const reporteApi = {
  // Categorías
  getCategorias: async (): Promise<ApiResponse<Categoria[]>> => {
    return apiClient.get<Categoria[]>('/api/reportes/categorias');
  },

  // CRUD básico
  crear: async (payload: CrearReportePayload): Promise<ApiResponse<Reporte>> => {
    return apiClient.post<Reporte>('/api/reportes', payload);
  },

  obtenerTodos: async (): Promise<ApiResponse<Reporte[]>> => {
    return apiClient.get<Reporte[]>('/api/reportes');
  },

  obtenerMisReportes: async (): Promise<ApiResponse<Reporte[]>> => {
    return apiClient.get<Reporte[]>('/api/reportes/me');
  },

  obtenerPorId: async (id: string): Promise<ApiResponse<Reporte>> => {
    return apiClient.get<Reporte>(`/api/reportes/${id}`);
  },

  actualizar: async (
    id: string,
    payload: ActualizarReportePayload,
  ): Promise<ApiResponse<Reporte>> => {
    return apiClient.patch<Reporte>(`/api/reportes/${id}`, payload);
  },

  eliminar: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/reportes/${id}`);
  },

  // Zona operativa (ADMIN/BRIGADISTA)
  obtenerHistorial: async (id: string): Promise<ApiResponse<HistorialEntry[]>> => {
    return apiClient.get<HistorialEntry[]>(`/api/reportes/${id}/historial`);
  },

  cambiarEstado: async (
    id: string,
    payload: CambiarEstadoPayload,
  ): Promise<ApiResponse<Reporte>> => {
    return apiClient.patch<Reporte>(`/api/reportes/${id}/estado`, payload);
  },
};
