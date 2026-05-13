// src/entities/alerta/api/queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { alertaApi, type CrearAlertaPayload, type CambiarEstadoPayload } from './alerta.api';

export const useGetMisAlertas = () => {
  return useQuery({
    queryKey: ['alertas', 'mis-alertas'],
    queryFn: async () => {
      const response = await alertaApi.misAlertas();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useGetAlertasCercanas = (latitud: number, longitud: number, radio?: number) => {
  return useQuery({
    queryKey: ['alertas', 'cercanas', latitud, longitud, radio],
    queryFn: async () => {
      const response = await alertaApi.cercanas({ latitud, longitud, radio });
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: latitud !== 0 && longitud !== 0,
  });
};

export const useGetAlertaPorId = (id: string) => {
  return useQuery({
    queryKey: ['alertas', id],
    queryFn: async () => {
      const response = await alertaApi.obtenerPorId(id);
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetTodasAlertas = () => {
  return useQuery({
    queryKey: ['alertas', 'todas'],
    queryFn: async () => {
      const response = await alertaApi.obtenerTodas();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
  });
};

export const useCreateAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrearAlertaPayload) => alertaApi.crear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useVerificarAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertaApi.verificar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useCambiarEstadoAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CambiarEstadoPayload }) =>
      alertaApi.cambiarEstado(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas', variables.id] });
    },
  });
};

export const useEliminarAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertaApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};