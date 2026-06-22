// src/entities/emergencia/api/queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  emergenciaApi,
  type CrearDespachoPayload,
  type ActualizarEstadoPayload,
  type RetryDespachoPayload,
} from './emergencia.api';

export const useGetEstadoDespacho = (correlationId: string) => {
  return useQuery({
    queryKey: ['emergencias', 'despacho', correlationId],
    queryFn: async () => {
      const response = await emergenciaApi.obtenerEstadoDespacho(correlationId);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!correlationId,
    refetchInterval: 10000,
  });
};

export const useCreateDespacho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CrearDespachoPayload) => {
      const response = await emergenciaApi.crearDespacho(payload);
      if (!response.success) throw new Error(response.error?.message || 'Error al crear despacho');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencias'] });
    },
  });
};

export const useActualizarEstadoDespacho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ActualizarEstadoPayload }) => {
      const response = await emergenciaApi.actualizarEstadoDespacho(id, payload);
      if (!response.success) throw new Error(response.error?.message || 'Error al actualizar');
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emergencias'] });
      queryClient.invalidateQueries({ queryKey: ['emergencias', 'despacho', variables.id] });
    },
  });
};

export const useRetryDespacho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RetryDespachoPayload) => {
      const response = await emergenciaApi.reintentarDespacho(payload);
      if (!response.success) throw new Error(response.error?.message || 'Error al reintentar');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencias'] });
    },
  });
};
