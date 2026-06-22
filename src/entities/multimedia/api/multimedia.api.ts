// src/entities/multimedia/api/multimedia.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';

export interface ArchivoMultimedia {
  id: string;
  nombreOriginal: string;
  tipoMime: string;
  tamano: number;
  url: string;
  entidadTipo?: EntidadTipo;
  entidadId?: string;
  usuarioId: string;
  createdAt: string;
  updatedAt?: string;
}

export type EntidadTipo = 'ALERTA' | 'REPORTE' | 'FOCO' | 'DESPACHO';

export interface VincularArchivoPayload {
  entidadTipo: EntidadTipo;
  entidadId: string;
}

export interface SubirArchivoResponse {
  id: string;
  url: string;
  nombreOriginal: string;
}

export const multimediaApi = {
  subirArchivo: async (formData: FormData): Promise<ApiResponse<SubirArchivoResponse>> => {
    return apiClient.post<SubirArchivoResponse>('/api/multimedia/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  vincularArchivo: async (
    id: string,
    payload: VincularArchivoPayload,
  ): Promise<ApiResponse<ArchivoMultimedia>> => {
    return apiClient.patch<ArchivoMultimedia>(`/api/multimedia/${id}/vincular`, payload);
  },

  eliminarArchivo: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/multimedia/${id}`);
  },
};
