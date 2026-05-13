// src/entities/emergencia/model/store.ts
import { create } from 'zustand';
import type { Despacho, DespachoEstado } from '../api/emergencia.api';

interface EmergenciaState {
  despachos: Despacho[];
  despachoActual: Despacho | null;
  filtroEstado: DespachoEstado | null;
  isLoading: boolean;
  error: string | null;

  setDespachos: (despachos: Despacho[]) => void;
  setDespachoActual: (despacho: Despacho | null) => void;
  setFiltroEstado: (estado: DespachoEstado | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  limpiarFiltros: () => void;
}

export const useEmergenciaStore = create<EmergenciaState>((set) => ({
  despachos: [],
  despachoActual: null,
  filtroEstado: null,
  isLoading: false,
  error: null,

  setDespachos: (despachos) => set({ despachos }),
  setDespachoActual: (despacho) => set({ despachoActual: despacho }),
  setFiltroEstado: (estado) => set({ filtroEstado: estado }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  limpiarFiltros: () => set({ filtroEstado: null, despachoActual: null, error: null }),
}));