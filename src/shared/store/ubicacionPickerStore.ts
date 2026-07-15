import { create } from 'zustand';

interface UbicacionPickerState {
  pendingLocation: { lat: number; lng: number } | null;
  setPendingLocation: (loc: { lat: number; lng: number } | null) => void;
}

export const useUbicacionPickerStore = create<UbicacionPickerState>((set) => ({
  pendingLocation: null,
  setPendingLocation: (loc) => set({ pendingLocation: loc }),
}));
