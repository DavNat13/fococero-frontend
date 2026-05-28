// src/entities/emergencia/api/emergencia.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';

export interface Despacho {
  id: string;
  alertaId: string;
  organismoId: string;
  organismoNombre?: string;
  estado: DespachoEstado;
  correlationId: string;
  mensaje?: string;
  respuestaOrganismo?: string;
  createdAt: string;
  updatedAt?: string;
}

export type DespachoEstado =
  | 'PENDIENTE'
  | 'ENVIADO'
  | 'ACEPTADO'
  | 'RECHAZADO'
  | 'CANCELADO'
  | 'COMPLETADO';

export interface Organismo {
  id: string;
  nombre: string;
  tipo: OrganismoTipo;
  contacto?: string;
  telefono?: string;
}

export type OrganismoTipo = 'CONAF' | 'BOMBEROS' | 'AMBULANCIA' | 'POLICIA' | 'DEFENSA_CIVIL';

export interface CrearDespachoPayload {
  alertaId: string;
  organismoId: string;
  mensaje?: string;
}

export interface ActualizarEstadoPayload {
  estado: DespachoEstado;
  respuestaOrganismo?: string;
}

export interface RetryDespachoPayload {
  despachoId: string;
}

export const emergenciaApi = {
  crearDespacho: async (payload: CrearDespachoPayload): Promise<ApiResponse<Despacho>> => {
    return apiClient.post<Despacho>('/api/emergencias/despachos', payload);
  },

  obtenerEstadoDespacho: async (correlationId: string): Promise<ApiResponse<Despacho>> => {
    return apiClient.get<Despacho>(`/api/emergencias/despachos/${correlationId}`);
  },

  actualizarEstadoDespacho: async (
    id: string,
    payload: ActualizarEstadoPayload,
  ): Promise<ApiResponse<Despacho>> => {
    return apiClient.patch<Despacho>(`/api/emergencias/despachos/${id}/estado`, payload);
  },

  reintentarDespacho: async (payload: RetryDespachoPayload): Promise<ApiResponse<Despacho>> => {
    return apiClient.post<Despacho>('/api/emergencias/despachos/retry', payload);
  },
};
