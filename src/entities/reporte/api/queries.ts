// src/entities/reporte/api/queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  reporteApi,
  type CrearReportePayload,
  type ActualizarReportePayload,
  type CambiarEstadoPayload,
} from './reporte.api';

export const useGetCategorias = () => {
  return useQuery({
    queryKey: ['reportes', 'categorias'],
    queryFn: async () => {
      const response = await reporteApi.getCategorias();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetTodosReportes = () => {
  return useQuery({
    queryKey: ['reportes', 'todos'],
    queryFn: async () => {
      const response = await reporteApi.obtenerTodos();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetMisReportes = () => {
  return useQuery({
    queryKey: ['reportes', 'mis-reportes'],
    queryFn: async () => {
      const response = await reporteApi.obtenerMisReportes();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
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
    mutationFn: (payload: CrearReportePayload) => reporteApi.crear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};

export const useUpdateReporte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActualizarReportePayload }) =>
      reporteApi.actualizar(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
      queryClient.invalidateQueries({ queryKey: ['reportes', variables.id] });
    },
  });
};

export const useDeleteReporte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reporteApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};

export const useCambiarEstadoReporte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CambiarEstadoPayload }) =>
      reporteApi.cambiarEstado(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
      queryClient.invalidateQueries({ queryKey: ['reportes', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['reportes', variables.id, 'historial'] });
    },
  });
};
