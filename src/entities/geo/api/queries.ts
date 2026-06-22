// src/entities/geo/api/queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  geoApi,
  type CrearFocoPayload,
  type ActualizarFocoPayload,
  type CambiarEstadoPayload,
  type ActualizarPerimetroPayload,
  type FocosCercanosParams,
} from './geo.api';

export const useGetTodosFocos = () => {
  return useQuery({
    queryKey: ['geo', 'todos'],
    queryFn: async () => {
      const response = await geoApi.obtenerTodos();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetFocosCercanos = (params: FocosCercanosParams) => {
  return useQuery({
    queryKey: ['geo', 'cercanos', params.latitud, params.longitud, params.radio],
    queryFn: async () => {
      const response = await geoApi.obtenerCercanos(params);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: params.latitud !== 0 && params.longitud !== 0,
  });
};

export const useGetFocoPorId = (id: string) => {
  return useQuery({
    queryKey: ['geo', id],
    queryFn: async () => {
      const response = await geoApi.obtenerPorId(id);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateFoco = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearFocoPayload) => geoApi.reportarFoco(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geo'] });
    },
  });
};

export const useCambiarEstadoFoco = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CambiarEstadoPayload }) =>
      geoApi.cambiarEstado(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geo'] });
      queryClient.invalidateQueries({ queryKey: ['geo', variables.id] });
    },
  });
};

export const useActualizarPerimetroFoco = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActualizarPerimetroPayload }) =>
      geoApi.actualizarPerimetro(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geo'] });
      queryClient.invalidateQueries({ queryKey: ['geo', variables.id] });
    },
  });
};

export const useUpdateFoco = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActualizarFocoPayload }) =>
      geoApi.actualizarCompleto(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geo'] });
      queryClient.invalidateQueries({ queryKey: ['geo', variables.id] });
    },
  });
};

export const useDeleteFoco = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => geoApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geo'] });
    },
  });
};
