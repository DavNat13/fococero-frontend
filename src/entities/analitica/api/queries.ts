// src/entities/analitica/api/queries.ts
import { useQuery } from '@tanstack/react-query';
import { analiticaApi, type FiltrosAnalitica } from './analitica.api';

export const useGetMetrics = () => {
  return useQuery({
    queryKey: ['analitica', 'metrics'],
    queryFn: async () => {
      const response = await analiticaApi.getMetrics();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetKPIs = () => {
  return useQuery({
    queryKey: ['analitica', 'kpis'],
    queryFn: async () => {
      const response = await analiticaApi.getKPIs();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetKpisCiudadano = () => {
  return useQuery({
    queryKey: ['analitica', 'kpis-ciudadano'],
    queryFn: async () => {
      const response = await analiticaApi.getKpisCiudadano();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    staleTime: 30000,
  });
};

export const useGetKpisBrigadista = () => {
  return useQuery({
    queryKey: ['analitica', 'kpis-brigadista'],
    queryFn: async () => {
      const response = await analiticaApi.getKpisBrigadista();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetKpisAdmin = () => {
  return useQuery({
    queryKey: ['analitica', 'kpis-admin'],
    queryFn: async () => {
      const response = await analiticaApi.getKpisAdmin();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetTendencias = (filtros?: FiltrosAnalitica) => {
  return useQuery({
    queryKey: ['analitica', 'tendencias', filtros],
    queryFn: async () => {
      const response = await analiticaApi.getTendencias(filtros);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetDistribucion = () => {
  return useQuery({
    queryKey: ['analitica', 'distribucion'],
    queryFn: async () => {
      const response = await analiticaApi.getDistribucion();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetAnomalias = () => {
  return useQuery({
    queryKey: ['analitica', 'anomalias'],
    queryFn: async () => {
      const response = await analiticaApi.getAnomalias();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetHeatmap = (filtros?: FiltrosAnalitica) => {
  return useQuery({
    queryKey: ['analitica', 'heatmap', filtros],
    queryFn: async () => {
      const response = await analiticaApi.getHeatmap(filtros);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetDetalleCuadrante = (geohash: string) => {
  return useQuery({
    queryKey: ['analitica', 'cuadrante', geohash],
    queryFn: async () => {
      const response = await analiticaApi.getDetalleCuadrante(geohash);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!geohash,
  });
};

export const useGetPredicciones = () => {
  return useQuery({
    queryKey: ['analitica', 'predicciones'],
    queryFn: async () => {
      const response = await analiticaApi.getPredicciones();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};
