// src/entities/analitica/api/analitica.api.ts

import { apiClient } from '@core/api';
import type { ApiResponse } from '@core/api';

export interface KPIs {
  totalAlertas: number;
  alertasActivas: number;
  alertasResueltas: number;
  tiempoPromedioRespuesta: number;
  focosActivos: number;
  dispatchEnviados: number;
}

export interface KpisCiudadano {
  total_reportadas: number;
  activas: number;
  resueltas: number;
  focos_cercanos: number;
  alertas_cercanas: number;
}

export interface Tendencia {
  periodo: string;
  cantidad: number;
  tipo: string;
}

export interface Distribucion {
  categoria: string;
  cantidad: number;
  porcentaje: number;
}

export interface Anomalia {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
  severidad: 'BAJA' | 'MEDIA' | 'ALTA';
}

export interface HeatmapCell {
  latitud: number;
  longitud: number;
  intensidad: number;
  cantidad: number;
}

export interface CuadranteDetalle {
  id: string;
  nombre: string;
  alertas: number;
  focos: number;
  riesgo: number;
  centroid: { lat: number; lng: number };
}

export interface Prediction {
  id: string;
  fechaPredicha: string;
  probabilidad: number;
  zona: string;
  tipo: string;
  confianza: number;
}

export interface FiltrosAnalitica {
  fechaInicio?: string;
  fechaFin?: string;
  region?: string;
  tipo?: string;
}

export const analiticaApi = {
  // Ops - Métricas operativas
  getMetrics: async (): Promise<ApiResponse<KPIs>> => {
    return apiClient.get<KPIs>('/api/analitica/ops/metrics');
  },

  // Core - KPIs y métricas principales
  getKPIs: async (): Promise<ApiResponse<KPIs>> => {
    return apiClient.get<KPIs>('/api/analitica/core/kpis');
  },

  getKpisCiudadano: async (): Promise<ApiResponse<KpisCiudadano>> => {
    return apiClient.get<KpisCiudadano>('/api/analitica/core/kpis-ciudadano');
  },

  getKpisBrigadista: async (): Promise<ApiResponse<KPIs>> => {
    return apiClient.get<KPIs>('/api/analitica/core/kpis-brigadista');
  },

  getKpisAdmin: async (): Promise<ApiResponse<KPIs>> => {
    return apiClient.get<KPIs>('/api/analitica/core/kpis-admin');
  },

  getTendencias: async (filtros?: FiltrosAnalitica): Promise<ApiResponse<Tendencia[]>> => {
    return apiClient.get<Tendencia[]>('/api/analitica/core/tendencias', { params: filtros });
  },

  getDistribucion: async (): Promise<ApiResponse<Distribucion[]>> => {
    return apiClient.get<Distribucion[]>('/api/analitica/core/distribucion');
  },

  getAnomalias: async (): Promise<ApiResponse<Anomalia[]>> => {
    return apiClient.get<Anomalia[]>('/api/analitica/core/anomalias');
  },

  // Espacial - Mapas de calor
  getHeatmap: async (filtros?: FiltrosAnalitica): Promise<ApiResponse<HeatmapCell[]>> => {
    return apiClient.get<HeatmapCell[]>('/api/analitica/espacial/heatmap', { params: filtros });
  },

  getDetalleCuadrante: async (geohash: string): Promise<ApiResponse<CuadranteDetalle>> => {
    return apiClient.get<CuadranteDetalle>('/api/analitica/espacial/detalle', {
      params: { geohash },
    });
  },

  getPorRadio: async (
    lat: number,
    lng: number,
    radioMetros: number,
  ): Promise<ApiResponse<HeatmapCell[]>> => {
    return apiClient.get<HeatmapCell[]>('/api/analitica/espacial/radio', {
      params: { lat, lng, radioMetros },
    });
  },

  // Predictiva - Predicciones
  getPredicciones: async (): Promise<ApiResponse<Prediction[]>> => {
    return apiClient.get<Prediction[]>('/api/analitica/predictiva/forecast');
  },

  // Exportar
  exportarReporte: async (
    formato: 'csv' | 'pdf',
    filtros?: FiltrosAnalitica,
  ): Promise<ApiResponse<Blob>> => {
    return apiClient.get<Blob>(`/api/analitica/exportar/${formato}`, { params: filtros });
  },
};
