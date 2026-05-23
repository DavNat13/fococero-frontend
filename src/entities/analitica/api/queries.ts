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

export const useGetDetalleCuadrante = (cuadranteId: string) => {
  return useQuery({
    queryKey: ['analitica', 'cuadrante', cuadranteId],
    queryFn: async () => {
      const response = await analiticaApi.getDetalleCuadrante(cuadranteId);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!cuadranteId,
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