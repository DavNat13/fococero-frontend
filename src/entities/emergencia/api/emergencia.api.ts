import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';

export interface Despacho {
  id: string;
  alerta_id: string;
  correlation_id: string;
  organismo: string;
  estado: DespachoEstado;
  prioridad: string;
  request_payload: Record<string, unknown>;
  response_payload: Record<string, unknown> | null;
  endpoint_url: string;
  intentos_actuales: number;
  max_reintentos_permitidos: number;
  duracion_ms: number | null;
  codigo_error_http: number | null;
  error_detalle: string | null;
  created_at: string;
  updated_at: string;
  finalizado_at: string | null;
}

export type DespachoEstado =
  | 'PENDIENTE'
  | 'PROCESANDO'
  | 'EXITOSO'
  | 'FALLIDO'
  | 'REINTENTANDO'
  | 'CANCELADO';

export type OrganismoTipo =
  | 'BOMBEROS'
  | 'CONAF'
  | 'SAMU'
  | 'CARABINEROS'
  | 'PDI'
  | 'SENAPRED'
  | 'MUNICIPALIDAD'
  | 'DELEGACION'
  | 'EJERCITO'
  | 'ARMADA'
  | 'SERVICIOS_PUBLICOS';

export interface CrearDespachoPayload {
  alerta_id: string;
  correlation_id: string;
  organismo: OrganismoTipo;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  request_payload: Record<string, unknown>;
  endpoint_url: string;
}

export interface ActualizarEstadoPayload {
  estado: DespachoEstado;
}

export interface RetryDespachoPayload {
  despachoId: string;
}

const ENDPOINT_URLS: Record<OrganismoTipo, string> = {
  BOMBEROS: 'https://api.bomberos.cl/',
  CONAF: 'https://api.conaf.cl/',
  SAMU: 'https://api.samu.cl/',
  CARABINEROS: 'https://api.carabineros.cl/',
  PDI: 'https://api.pdi.cl/',
  SENAPRED: 'https://api.senapred.cl/',
  MUNICIPALIDAD: 'https://api.municipalidad.cl/',
  DELEGACION: 'https://api.delegacion.cl/',
  EJERCITO: 'https://api.ejercito.cl/',
  ARMADA: 'https://api.armada.cl/',
  SERVICIOS_PUBLICOS: 'https://api.servicios-publicos.cl/',
};

export function getEndpointUrl(organismo: OrganismoTipo): string {
  return ENDPOINT_URLS[organismo];
}

export function getOrganismoLabel(organismo: OrganismoTipo): string {
  const labels: Record<OrganismoTipo, string> = {
    BOMBEROS: 'Bomberos',
    CONAF: 'CONAF',
    SAMU: 'Ambulancia',
    CARABINEROS: 'Carabineros',
    PDI: 'PDI',
    SENAPRED: 'Defensa Civil',
    MUNICIPALIDAD: 'Municipalidad',
    DELEGACION: 'Delegación',
    EJERCITO: 'Ejército',
    ARMADA: 'Armada',
    SERVICIOS_PUBLICOS: 'Servicios Públicos',
  };
  return labels[organismo];
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
