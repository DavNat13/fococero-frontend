// src/entities/alerta/hooks/useAlertaFeature.ts
import { useAlertaStore } from '../model/store';
import {
  useGetMisAlertas,
  useGetAlertasCercanas,
  useGetAlertaPorId,
  useGetTodasAlertas,
  useCreateAlerta,
  useVerificarAlerta,
  useCambiarEstadoAlerta,
  useEliminarAlerta,
} from '../api/queries';
import type { CrearAlertaPayload, CambiarEstadoPayload } from '../api/alerta.api';

export const useAlertaFeature = () => {
  const { alertaSeleccionada, filtroEstado, setAlertaSeleccionada, setFiltroEstado, limpiarFiltros } =
    useAlertaStore();

  const misAlertasQuery = useGetMisAlertas();
  const todasAlertasQuery = useGetTodasAlertas();
  const createMutation = useCreateAlerta();
  const verificarMutation = useVerificarAlerta();
  const estadoMutation = useCambiarEstadoAlerta();
  const eliminarMutation = useEliminarAlerta();

  const crearAlerta = async (payload: CrearAlertaPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  };

  const verificarAlerta = async (id: string) => {
    try {
      await verificarMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  };

  const cambiarEstadoAlerta = async (id: string, payload: CambiarEstadoPayload) => {
    try {
      await estadoMutation.mutateAsync({ id, payload });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  };

  const eliminarAlerta = async (id: string) => {
    try {
      await eliminarMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  };

  const alertasFiltradas =
    misAlertasQuery.data?.filter((a) => !filtroEstado || a.estado === filtroEstado) || [];

  return {
    misAlertas: alertasFiltradas,
    todasAlertas: todasAlertasQuery.data || [],
    alertaSeleccionada,
    filtroEstado,
    isLoading: misAlertasQuery.isLoading || todasAlertasQuery.isLoading,
    isCreating: createMutation.isPending,
    error: misAlertasQuery.error?.message || todasAlertasQuery.error?.message || null,

    setAlertaSeleccionada,
    setFiltroEstado,
    limpiarFiltros,
    crearAlerta,
    verificarAlerta,
    cambiarEstadoAlerta,
    eliminarAlerta,
  };
};

export const useAlertasCercanas = (latitud: number, longitud: number, radio?: number) => {
  const query = useGetAlertasCercanas(latitud, longitud, radio);
  return {
    alertas: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
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