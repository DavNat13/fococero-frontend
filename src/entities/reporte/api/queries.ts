// src/entities/reporte/api/queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  reporteApi,
  type CrearReportePayload,
  type ActualizarReportePayload,
  type CambiarEstadoPayload,
} from './reporte.api';

export const useGetCategorias = (options?: { staleTime?: number; retry?: number }) => {
  return useQuery({
    queryKey: ['reportes', 'categorias'],
    queryFn: async () => {
      const response = await reporteApi.getCategorias();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    staleTime: options?.staleTime ?? 30000,
    retry: options?.retry ?? 1,
  });
};

export const useGetTodosReportes = (options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ['reportes', 'todos'],
    queryFn: async () => {
      const response = await reporteApi.obtenerTodos();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    refetchInterval: options?.refetchInterval,
  });
};

export const useGetMisReportes = (options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ['reportes', 'mis-reportes'],
    queryFn: async () => {
      const response = await reporteApi.obtenerMisReportes();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    staleTime: 30000,
    refetchInterval: options?.refetchInterval,
  });
};

export const useGetReportePorId = (id: string) => {
  return useQuery({
    queryKey: ['reportes', id],
    queryFn: async () => {
      const response = await reporteApi.obtenerPorId(id);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetHistorialReporte = (id: string) => {
  return useQuery({
    queryKey: ['reportes', id, 'historial'],
    queryFn: async () => {
      const response = await reporteApi.obtenerHistorial(id);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateReporte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CrearReportePayload) => {
      const response = await reporteApi.crear(payload);
      if (!response.success) throw new Error(response.error?.message || 'Error al crear reporte');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};

export const useUpdateReporte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ActualizarReportePayload }) => {
      const response = await reporteApi.actualizar(id, payload);
      if (!response.success) throw new Error(response.error?.message || 'Error al actualizar');
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
      queryClient.invalidateQueries({ queryKey: ['reportes', variables.id] });
    },
  });
};

export const useDeleteReporte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await reporteApi.eliminar(id);
      if (!response.success) throw new Error(response.error?.message || 'Error al eliminar');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};

export const useCambiarEstadoReporte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: CambiarEstadoPayload }) => {
      const response = await reporteApi.cambiarEstado(id, payload);
      if (!response.success) throw new Error(response.error?.message || 'Error al cambiar estado');
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
      queryClient.invalidateQueries({ queryKey: ['reportes', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['reportes', variables.id, 'historial'] });
    },
  });
};
