// src/entities/alerta/model/store.ts
import { create } from 'zustand';
import type { Alerta, AlertaEstado } from '../api/alerta.api';

interface AlertaState {
  alertas: Alerta[];
  alertaSeleccionada: Alerta | null;
  filtroEstado: AlertaEstado | null;
  isLoading: boolean;
  error: string | null;

  setAlertas: (alertas: Alerta[]) => void;
  setAlertaSeleccionada: (alerta: Alerta | null) => void;
  setFiltroEstado: (estado: AlertaEstado | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  limpiarFiltros: () => void;
}

export const useAlertaStore = create<AlertaState>((set) => ({
  alertas: [],
  alertaSeleccionada: null,
  filtroEstado: null,
  isLoading: false,
  error: null,

  setAlertas: (alertas) => set({ alertas }),
  setAlertaSeleccionada: (alerta) => set({ alertaSeleccionada: alerta }),
  setFiltroEstado: (estado) => set({ filtroEstado: estado }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  limpiarFiltros: () => set({ filtroEstado: null, alertaSeleccionada: null, error: null }),
}));
