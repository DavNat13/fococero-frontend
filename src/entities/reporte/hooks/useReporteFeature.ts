// src/entities/reporte/hooks/useReporteFeature.ts
import { useMemo } from 'react';
import { useReporteStore } from '../model/store';
import {
  useGetTodosReportes,
  useGetMisReportes,
  useGetReportePorId,
  useGetHistorialReporte,
  useCreateReporte,
  useUpdateReporte,
  useDeleteReporte,
  useCambiarEstadoReporte,
} from '../api/queries';
import type {
  CrearReportePayload,
  ActualizarReportePayload,
  CambiarEstadoPayload,
} from '../api/reporte.api';

export const useReporteFeature = () => {
  const {
    reporteSeleccionado,
    filtroEstado,
    filtroCategoria,
    setReporteSeleccionado,
    setFiltroEstado,
    setFiltroCategoria,
    limpiarFiltros,
  } = useReporteStore();

  const misReportesQuery = useGetMisReportes();
  const createMutation = useCreateReporte();
  const updateMutation = useUpdateReporte();
  const deleteMutation = useDeleteReporte();
  const estadoMutation = useCambiarEstadoReporte();

  return useMemo(
    () => ({
      misReportes: (misReportesQuery.data || []).filter((r) => {
        const coincideEstado = !filtroEstado || r.estado === filtroEstado;
        const coincideCategoria = !filtroCategoria || r.categoria_id === filtroCategoria;
        return coincideEstado && coincideCategoria;
      }),
      reporteSeleccionado,
      filtroEstado,
      filtroCategoria,
      isLoading: misReportesQuery.isLoading,
      error: misReportesQuery.error?.message || null,

      setReporteSeleccionado,
      setFiltroEstado,
      setFiltroCategoria,
      limpiarFiltros,

      crearReporte: async (payload: CrearReportePayload) => {
        try {
          await createMutation.mutateAsync(payload);
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
          };
        }
      },

      actualizarReporte: async (id: string, payload: ActualizarReportePayload) => {
        try {
          await updateMutation.mutateAsync({ id, payload });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
          };
        }
      },

      eliminarReporte: async (id: string) => {
        try {
          await deleteMutation.mutateAsync(id);
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
          };
        }
      },

      cambiarEstadoReporte: async (id: string, payload: CambiarEstadoPayload) => {
        try {
          await estadoMutation.mutateAsync({ id, payload });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
          };
        }
      },
    }),
    [
      misReportesQuery.data,
      misReportesQuery.isLoading,
      misReportesQuery.error,
      reporteSeleccionado,
      filtroEstado,
      filtroCategoria,
      setReporteSeleccionado,
      setFiltroEstado,
      setFiltroCategoria,
      limpiarFiltros,
      createMutation,
      updateMutation,
      deleteMutation,
      estadoMutation,
    ],
  );
};

/**
 * Standalone hook for ADMIN/BRIGADISTA to fetch ALL reportes.
 * Separated from useReporteFeature to avoid FORBIDDEN errors for citizens.
 */
export const useTodosReportes = (options?: { refetchInterval?: number }) => {
  const query = useGetTodosReportes(options);
  const todosReportes = useMemo(() => query.data ?? [], [query.data]);
  return {
    todosReportes,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useReportePorId = (id: string) => {
  const query = useGetReportePorId(id);
  return {
    reporte: query.data || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
};

export const useHistorialReporte = (id: string) => {
  const query = useGetHistorialReporte(id);
  return {
    historial: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
};
