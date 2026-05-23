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
    mutationFn: (payload: CrearDespachoPayload) => emergenciaApi.crearDespacho(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencias'] });
    },
  });
};

export const useActualizarEstadoDespacho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActualizarEstadoPayload }) =>
      emergenciaApi.actualizarEstadoDespacho(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emergencias'] });
      queryClient.invalidateQueries({ queryKey: ['emergencias', 'despacho', variables.id] });
    },
  });
};

export const useRetryDespacho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RetryDespachoPayload) => emergenciaApi.reintentarDespacho(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencias'] });
    },
  });
};