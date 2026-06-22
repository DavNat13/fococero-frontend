// src/entities/analitica/hooks/useAnaliticaFeature.ts
import { useAnaliticaStore } from '../model/store';
import {
  useGetKPIs,
  useGetTendencias,
  useGetDistribucion,
  useGetAnomalias,
  useGetHeatmap,
  useGetPredicciones,
} from '../api/queries';
import type { FiltrosAnalitica } from '../api/analitica.api';

export const useAnaliticaFeature = () => {
  const { filtrosActivos, periodoSeleccionado, setFiltros, setPeriodo, limpiarFiltros } =
    useAnaliticaStore();

  const kpisQuery = useGetKPIs();
  const tendenciasQuery = useGetTendencias(filtrosActivos);
  const distribucionQuery = useGetDistribucion();
  const anomaliasQuery = useGetAnomalias();
  const heatmapQuery = useGetHeatmap(filtrosActivos);
  const prediccionesQuery = useGetPredicciones();

  const actualizarFiltros = (filtros: FiltrosAnalitica) => {
    setFiltros(filtros);
  };

  const cambiarPeriodo = (periodo: '24h' | '7d' | '30d' | '90d') => {
    setPeriodo(periodo);
    const now = new Date();
    let fechaInicio: string;

    switch (periodo) {
      case '24h':
        fechaInicio = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case '7d':
        fechaInicio = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '30d':
        fechaInicio = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '90d':
        fechaInicio = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
        break;
    }

    setFiltros({ ...filtrosActivos, fechaInicio });
  };

  const isLoading =
    kpisQuery.isLoading ||
    tendenciasQuery.isLoading ||
    distribucionQuery.isLoading ||
    anomaliasQuery.isLoading ||
    heatmapQuery.isLoading ||
    prediccionesQuery.isLoading;

  const error =
    kpisQuery.error?.message ||
    tendenciasQuery.error?.message ||
    distribucionQuery.error?.message ||
    anomaliasQuery.error?.message ||
    heatmapQuery.error?.message ||
    prediccionesQuery.error?.message ||
    null;

  return {
    kpis: kpisQuery.data || null,
    tendencias: tendenciasQuery.data || [],
    distribucion: distribucionQuery.data || [],
    anomalias: anomaliasQuery.data || [],
    heatmap: heatmapQuery.data || [],
    predicciones: prediccionesQuery.data || [],
    filtrosActivos,
    periodoSeleccionado,
    isLoading,
    error,
    actualizarFiltros,
    cambiarPeriodo,
    limpiarFiltros,
  };
};

export const useDashboardMetrics = () => {
  const kpisQuery = useGetKPIs();
  return {
    kpis: kpisQuery.data || null,
    isLoading: kpisQuery.isLoading,
    error: kpisQuery.error?.message || null,
    refetch: kpisQuery.refetch,
  };
};

export const useHeatmapData = (filtros?: FiltrosAnalitica) => {
  const query = useGetHeatmap(filtros);
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
};

export const usePredicciones = () => {
  const query = useGetPredicciones();
  return {
    predicciones: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
};
