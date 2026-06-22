// src/entities/alerta/hooks/useAlertaFeature.ts
import { useAlertaStore } from '../model/store';
import {
  useGetMisAlertas,
  useGetAlertasCercanas,
  useGetAlertaPorId,
  useGetAlertasPublicas,
  useCreateAlerta,
  useVerificarAlerta,
  useCambiarEstadoAlerta,
  useEliminarAlerta,
} from '../api/queries';
import type { CrearAlertaPayload, CambiarEstadoPayload } from '../api/alerta.api';

export const useAlertaFeature = () => {
  const {
    alertaSeleccionada,
    filtroEstado,
    setAlertaSeleccionada,
    setFiltroEstado,
    limpiarFiltros,
  } = useAlertaStore();

  const misAlertasQuery = useGetMisAlertas();
  const alertasPublicasQuery = useGetAlertasPublicas();
  const createMutation = useCreateAlerta();
  const verificarMutation = useVerificarAlerta();
  const estadoMutation = useCambiarEstadoAlerta();
  const eliminarMutation = useEliminarAlerta();

  const crearAlerta = async (payload: CrearAlertaPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  const verificarAlerta = async (id: string, esFuegoConfirmado = true) => {
    try {
      await verificarMutation.mutateAsync({ id, esFuegoConfirmado });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  const cambiarEstadoAlerta = async (id: string, payload: CambiarEstadoPayload) => {
    try {
      await estadoMutation.mutateAsync({ id, payload });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  const eliminarAlerta = async (id: string) => {
    try {
      await eliminarMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  const alertasFiltradas =
    misAlertasQuery.data?.filter((a) => !filtroEstado || a.estado === filtroEstado) || [];

  return {
    misAlertas: alertasFiltradas,
    alertasPublicas: alertasPublicasQuery.data || [],
    alertaSeleccionada,
    filtroEstado,
    isLoading: misAlertasQuery.isLoading || alertasPublicasQuery.isLoading,
    isCreating: createMutation.isPending,
    error: misAlertasQuery.error?.message || alertasPublicasQuery.error?.message || null,

    setAlertaSeleccionada,
    setFiltroEstado,
    limpiarFiltros,
    crearAlerta,
    verificarAlerta,
    cambiarEstadoAlerta,
    eliminarAlerta,
  };
};

export const useAlertasCercanas = (
  lat: number,
  lng: number,
  radio?: number,
  options?: { refetchInterval?: number },
) => {
  const query = useGetAlertasCercanas(lat, lng, radio, options);
  return {
    alertas: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useAlertaPorId = (id: string) => {
  const query = useGetAlertaPorId(id);
  return {
    alerta: query.data || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
};
