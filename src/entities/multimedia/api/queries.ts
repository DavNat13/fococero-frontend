// src/entities/multimedia/api/queries.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { multimediaApi, type VincularArchivoPayload } from './multimedia.api';

export const useSubirArchivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => multimediaApi.subirArchivo(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multimedia'] });
    },
  });
};

export const useVincularArchivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VincularArchivoPayload }) =>
      multimediaApi.vincularArchivo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multimedia'] });
    },
  });
};

export const useEliminarArchivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => multimediaApi.eliminarArchivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multimedia'] });
    },
  });
};
