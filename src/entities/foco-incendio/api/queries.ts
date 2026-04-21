// src/entities/foco-incendio/api/queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    actualizarEstadoFoco,
    crearFoco,
    eliminarFoco,
    getFocos
} from './service';

export const useGetFocos = () => {
  return useQuery({
    queryKey: ['focos-incendio'],
    queryFn: getFocos,
  });
};

// --- MUTACIONES ---

export const useCreateFoco = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearFoco,
    onSuccess: () => {
      // Invalidamos la lista para que se recargue con el nuevo foco
      queryClient.invalidateQueries({ queryKey: ['focos-incendio'] });
    },
  });
};

export const useUpdateFocoEstado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { estado: any } }) =>
      actualizarEstadoFoco(id, data),
    onSuccess: (_, variables) => {
      // Actualizamos la lista y el detalle específico del foco
      queryClient.invalidateQueries({ queryKey: ['focos-incendio'] });
      queryClient.invalidateQueries({ queryKey: ['focos-incendio', variables.id] });
    },
  });
};

export const useDeleteFoco = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarFoco,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focos-incendio'] });
    },
  });
};
