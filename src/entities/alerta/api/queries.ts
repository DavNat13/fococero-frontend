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
    staleTime: 30000,
  });
};

export const useGetAlertasCercanas = (
  lat: number,
  lng: number,
  radio?: number,
  options?: { refetchInterval?: number },
) => {
  return useQuery({
    queryKey: ['alertas', 'cercanas', lat, lng, radio],
    queryFn: async () => {
      const response = await alertaApi.cercanas({ lat, lng, radio });
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    enabled: !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0,
    refetchInterval: options?.refetchInterval,
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

export const useGetAlertasPublicas = () => {
  return useQuery({
    queryKey: ['alertas', 'publicas'],
    queryFn: async () => {
      const response = await alertaApi.alertasPublicas();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    staleTime: 30000,
  });
};

export const useGetTodasAlertas = (options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ['alertas', 'todas'],
    queryFn: async () => {
      const response = await alertaApi.obtenerTodas();
      if (!response.success) throw new Error(response.error.message);
      return response.data;
    },
    refetchInterval: options?.refetchInterval,
  });
};

export const useCreateAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CrearAlertaPayload) => {
      const response = await alertaApi.crear(payload);
      if (!response.success) throw new Error(response.error?.message || 'Error al crear alerta');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useVerificarAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, esFuegoConfirmado }: { id: string; esFuegoConfirmado: boolean }) => {
      const response = await alertaApi.verificar(id, esFuegoConfirmado);
      if (!response.success) throw new Error(response.error?.message || 'Error al verificar');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useCambiarEstadoAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: CambiarEstadoPayload }) => {
      const response = await alertaApi.cambiarEstado(id, payload);
      if (!response.success) throw new Error(response.error?.message || 'Error al cambiar estado');
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas', variables.id] });
    },
  });
};

export const useEliminarAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await alertaApi.eliminar(id);
      if (!response.success) throw new Error(response.error?.message || 'Error al eliminar');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};
