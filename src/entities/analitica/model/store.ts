// src/entities/analitica/model/store.ts
import { create } from 'zustand';
import type { KPIs, HeatmapCell, Prediction } from '../api/analitica.api';

interface AnaliticaState {
  kpis: KPIs | null;
  heatmap: HeatmapCell[];
  predicciones: Prediction[];
  filtrosActivos: {
    fechaInicio?: string;
    fechaFin?: string;
    region?: string;
    tipo?: string;
  };
  periodoSeleccionado: '24h' | '7d' | '30d' | '90d';
  isLoading: boolean;
  error: string | null;

  setKPIs: (kpis: KPIs) => void;
  setHeatmap: (heatmap: HeatmapCell[]) => void;
  setPredicciones: (predicciones: Prediction[]) => void;
  setFiltros: (filtros: AnaliticaState['filtrosActivos']) => void;
  setPeriodo: (periodo: AnaliticaState['periodoSeleccionado']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  limpiarFiltros: () => void;
}

export const useAnaliticaStore = create<AnaliticaState>((set) => ({
  kpis: null,
  heatmap: [],
  predicciones: [],
  filtrosActivos: {},
  periodoSeleccionado: '7d',
  isLoading: false,
  error: null,

  setKPIs: (kpis) => set({ kpis }),
  setHeatmap: (heatmap) => set({ heatmap }),
  setPredicciones: (predicciones) => set({ predicciones }),
  setFiltros: (filtros) => set({ filtrosActivos: filtros }),
  setPeriodo: (periodo) => set({ periodoSeleccionado: periodo }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  limpiarFiltros: () => set({ filtrosActivos: {}, error: null }),
}));
