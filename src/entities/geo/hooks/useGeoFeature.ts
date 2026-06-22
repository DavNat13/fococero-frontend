// src/entities/geo/hooks/useGeoFeature.ts
import { useGeoStore } from '../model/store';
import {
  useGetTodosFocos,
  useGetFocosCercanos,
  useGetFocoPorId,
  useCreateFoco,
  useCambiarEstadoFoco,
  useActualizarPerimetroFoco,
  useUpdateFoco,
  useDeleteFoco,
} from '../api/queries';
import type {
  CrearFocoPayload,
  CambiarEstadoPayload,
  ActualizarFocoPayload,
  FocosCercanosParams,
} from '../api/geo.api';

export const useGeoFeature = () => {
  const {
    focoSeleccionado,
    filtroEstado,
    centroMapa,
    zoomMapa,
    setFocoSeleccionado,
    setFiltroEstado,
    setCentroMapa,
    setZoomMapa,
    limpiarFiltros,
  } = useGeoStore();

  const todosFocosQuery = useGetTodosFocos();
  const createMutation = useCreateFoco();
  const estadoMutation = useCambiarEstadoFoco();
  const perimetroMutation = useActualizarPerimetroFoco();
  const updateMutation = useUpdateFoco();
  const deleteMutation = useDeleteFoco();

  const reportarFoco = async (payload: CrearFocoPayload) => {
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

  const cambiarEstadoFoco = async (id: string, payload: CambiarEstadoPayload) => {
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

  const actualizarPerimetroFoco = async (id: string, payload: any) => {
    try {
      await perimetroMutation.mutateAsync({ id, payload });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  const actualizarFoco = async (id: string, payload: ActualizarFocoPayload) => {
    try {
      await updateMutation.mutateAsync({ id, payload });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  const eliminarFoco = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  };

  const aplicarFiltros = (focos: any[]) => {
    return filtroEstado ? focos.filter((f) => f.estado === filtroEstado) : focos;
  };

  return {
    focos: aplicarFiltros(todosFocosQuery.data || []),
    focoSeleccionado,
    filtroEstado,
    centroMapa,
    zoomMapa,
    isLoading: todosFocosQuery.isLoading,
    error: todosFocosQuery.error?.message || null,

    setFocoSeleccionado,
    setFiltroEstado,
    setCentroMapa,
    setZoomMapa,
    limpiarFiltros,
    reportarFoco,
    cambiarEstadoFoco,
    actualizarPerimetroFoco,
    actualizarFoco,
    eliminarFoco,
  };
};

export const useFocosCercanos = (params: FocosCercanosParams) => {
  const query = useGetFocosCercanos(params);
  return {
    focos: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
};

export const useFocoPorId = (id: string) => {
  const query = useGetFocoPorId(id);
  return {
    foco: query.data || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
};
