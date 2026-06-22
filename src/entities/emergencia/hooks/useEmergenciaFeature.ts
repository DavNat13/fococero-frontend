// src/entities/emergencia/hooks/useEmergenciaFeature.ts
import { useEmergenciaStore } from '../model/store';
import {
  useGetEstadoDespacho,
  useCreateDespacho,
  useActualizarEstadoDespacho,
  useRetryDespacho,
} from '../api/queries';
import type { CrearDespachoPayload, ActualizarEstadoPayload } from '../api/emergencia.api';

export const useEmergenciaFeature = () => {
  const { despachoActual, filtroEstado, setDespachoActual, setFiltroEstado, limpiarFiltros } =
    useEmergenciaStore();

  const createMutation = useCreateDespacho();
  const estadoMutation = useActualizarEstadoDespacho();
  const retryMutation = useRetryDespacho();

  const crearDespacho = async (payload: CrearDespachoPayload) => {
    try {
      const result = await createMutation.mutateAsync(payload);
      return { success: true, correlationId: result.correlation_id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  const actualizarEstadoDespacho = async (id: string, payload: ActualizarEstadoPayload) => {
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

  const reintentarDespacho = async (despachoId: string) => {
    try {
      await retryMutation.mutateAsync({ despachoId });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  return {
    despachoActual,
    filtroEstado,
    isLoading: createMutation.isPending || estadoMutation.isPending || retryMutation.isPending,
    error:
      createMutation.error?.message ||
      estadoMutation.error?.message ||
      retryMutation.error?.message ||
      null,

    setDespachoActual,
    setFiltroEstado,
    limpiarFiltros,
    crearDespacho,
    actualizarEstadoDespacho,
    reintentarDespacho,
  };
};

export const useEstadoDespacho = (correlationId: string) => {
  const query = useGetEstadoDespacho(correlationId);
  return {
    despacho: query.data || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
