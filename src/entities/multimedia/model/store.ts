// src/entities/multimedia/model/store.ts
import { create } from 'zustand';
import type { ArchivoMultimedia } from '../api/multimedia.api';

interface MultimediaState {
  archivosSubiendo: number;
  progresoSubida: number;
  ultimoArchivoSubido: ArchivoMultimedia | null;
  error: string | null;

  setArchivosSubiendo: (count: number) => void;
  setProgresoSubida: (progreso: number) => void;
  setUltimoArchivoSubido: (archivo: ArchivoMultimedia | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMultimediaStore = create<MultimediaState>((set) => ({
  archivosSubiendo: 0,
  progresoSubida: 0,
  ultimoArchivoSubido: null,
  error: null,

  setArchivosSubiendo: (count) => set({ archivosSubiendo: count }),
  setProgresoSubida: (progreso) => set({ progresoSubida: progreso }),
  setUltimoArchivoSubido: (archivo) => set({ ultimoArchivoSubido: archivo }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      archivosSubiendo: 0,
      progresoSubida: 0,
      ultimoArchivoSubido: null,
      error: null,
    }),
}));
