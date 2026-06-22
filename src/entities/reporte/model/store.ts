// src/entities/reporte/model/store.ts
import { create } from 'zustand';
import type { Reporte, ReporteEstado, Categoria } from '../api/reporte.api';

interface ReporteState {
  reportes: Reporte[];
  misReportes: Reporte[];
  reporteSeleccionado: Reporte | null;
  categorias: Categoria[];
  filtroEstado: ReporteEstado | null;
  filtroCategoria: string | null;
  isLoading: boolean;
  error: string | null;

  setReportes: (reportes: Reporte[]) => void;
  setMisReportes: (reportes: Reporte[]) => void;
  setReporteSeleccionado: (reporte: Reporte | null) => void;
  setCategorias: (categorias: Categoria[]) => void;
  setFiltroEstado: (estado: ReporteEstado | null) => void;
  setFiltroCategoria: (categoriaId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  limpiarFiltros: () => void;
}

export const useReporteStore = create<ReporteState>((set) => ({
  reportes: [],
  misReportes: [],
  reporteSeleccionado: null,
  categorias: [],
  filtroEstado: null,
  filtroCategoria: null,
  isLoading: false,
  error: null,

  setReportes: (reportes) => set({ reportes }),
  setMisReportes: (misReportes) => set({ misReportes }),
  setReporteSeleccionado: (reporte) => set({ reporteSeleccionado: reporte }),
  setCategorias: (categorias) => set({ categorias }),
  setFiltroEstado: (estado) => set({ filtroEstado: estado }),
  setFiltroCategoria: (categoriaId) => set({ filtroCategoria: categoriaId }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  limpiarFiltros: () =>
    set({ filtroEstado: null, filtroCategoria: null, reporteSeleccionado: null, error: null }),
}));
