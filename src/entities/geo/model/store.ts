// src/entities/geo/model/store.ts
import { create } from 'zustand';
import type { GeoFoco, GeoFocoEstado } from '../api/geo.api';

interface GeoState {
  focos: GeoFoco[];
  focoSeleccionado: GeoFoco | null;
  filtroEstado: GeoFocoEstado | null;
  centroMapa: { latitud: number; longitud: number } | null;
  zoomMapa: number;
  isLoading: boolean;
  error: string | null;

  setFocos: (focos: GeoFoco[]) => void;
  setFocoSeleccionado: (foco: GeoFoco | null) => void;
  setFiltroEstado: (estado: GeoFocoEstado | null) => void;
  setCentroMapa: (centro: { latitud: number; longitud: number } | null) => void;
  setZoomMapa: (zoom: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  limpiarFiltros: () => void;
}

export const useGeoStore = create<GeoState>((set) => ({
  focos: [],
  focoSeleccionado: null,
  filtroEstado: null,
  centroMapa: null,
  zoomMapa: 12,
  isLoading: false,
  error: null,

  setFocos: (focos) => set({ focos }),
  setFocoSeleccionado: (foco) => set({ focoSeleccionado: foco }),
  setFiltroEstado: (estado) => set({ filtroEstado: estado }),
  setCentroMapa: (centro) => set({ centroMapa: centro }),
  setZoomMapa: (zoom) => set({ zoomMapa: zoom }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  limpiarFiltros: () => set({ filtroEstado: null, focoSeleccionado: null, error: null }),
}));