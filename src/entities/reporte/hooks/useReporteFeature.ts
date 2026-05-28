// src/entities/reporte/hooks/useReporteFeature.ts
import { useReporteStore } from '../model/store';
import {
  useGetCategorias,
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

  const categoriasQuery = useGetCategorias();
  const todosReportesQuery = useGetTodosReportes();
  const misReportesQuery = useGetMisReportes();
  const createMutation = useCreateReporte();
  const updateMutation = useUpdateReporte();
  const deleteMutation = useDeleteReporte();
  const estadoMutation = useCambiarEstadoReporte();

  const crearReporte = async (payload: CrearReportePayload) => {
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

  const actualizarReporte = async (id: string, payload: ActualizarReportePayload) => {
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

  const eliminarReporte = async (id: string) => {
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

  const cambiarEstadoReporte = async (id: string, payload: CambiarEstadoPayload) => {
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

  const aplicarFiltros = (reportes: any[]) => {
    return reportes.filter((r) => {
      const coincideEstado = !filtroEstado || r.estado === filtroEstado;
      const coincideCategoria = !filtroCategoria || r.categoriaId === filtroCategoria;
      return coincideEstado && coincideCategoria;
    });
  };

  return {
    categorias: categoriasQuery.data || [],
    todosReportes: aplicarFiltros(todosReportesQuery.data || []),
    misReportes: aplicarFiltros(misReportesQuery.data || []),
    reporteSeleccionado,
    filtroEstado,
    filtroCategoria,
    isLoading:
      categoriasQuery.isLoading || todosReportesQuery.isLoading || misReportesQuery.isLoading,
    error:
      categoriasQuery.error?.message ||
      todosReportesQuery.error?.message ||
      misReportesQuery.error?.message ||
      null,

    setReporteSeleccionado,
    setFiltroEstado,
    setFiltroCategoria,
    limpiarFiltros,
    crearReporte,
    actualizarReporte,
    eliminarReporte,
    cambiarEstadoReporte,
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
