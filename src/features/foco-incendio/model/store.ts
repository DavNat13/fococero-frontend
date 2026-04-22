// src/features/foco-incendio/model/foco-incendio.store.ts
import { create } from 'zustand';
import type { AlertaIncendio, GravedadAlerta } from '@/entities/foco-incendio/model/types';

interface FocoIncendioState {
  // Estado UI
  focoSeleccionado: AlertaIncendio | null;
  filtroGravedadActivo: GravedadAlerta | null;

  // Acciones
  seleccionarFoco: (foco: AlertaIncendio | null) => void;
  setFiltroGravedad: (gravedad: GravedadAlerta | null) => void;
  limpiarFiltros: () => void;
}

export const useFocoIncendioStore = create<FocoIncendioState>((set) => ({
  focoSeleccionado: null,
  filtroGravedadActivo: null,

  seleccionarFoco: (foco) => set({ focoSeleccionado: foco }),
  setFiltroGravedad: (gravedad) => set({ filtroGravedadActivo: gravedad }),
  limpiarFiltros: () => set({ filtroGravedadActivo: null, focoSeleccionado: null }),
}));
