// src/entities/multimedia/hooks/useMultimediaFeature.ts
import { useMultimediaStore } from '../model/store';
import { useSubirArchivo, useVincularArchivo, useEliminarArchivo } from '../api/queries';
import type { VincularArchivoPayload } from '../api/multimedia.api';

export const useMultimediaFeature = () => {
  const {
    archivosSubiendo,
    progresoSubida,
    ultimoArchivoSubido,
    error,
    setArchivosSubiendo,
    setUltimoArchivoSubido,
    setError,
    reset,
  } = useMultimediaStore();

  const uploadMutation = useSubirArchivo();
  const vincularMutation = useVincularArchivo();
  const eliminarMutation = useEliminarArchivo();

  const subirArchivo = async (
    file: File | Blob,
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      setArchivosSubiendo(archivosSubiendo + 1);
      setError(null);

      const formData = new FormData();
      formData.append('archivo', file);

      const result = await uploadMutation.mutateAsync(formData);

      if (result.success && result.data) {
        setUltimoArchivoSubido({
          id: result.data.id,
          nombreOriginal: result.data.nombreOriginal,
          tipoMime: file.type,
          tamano: file.size,
          url: result.data.url,
          usuarioId: '',
          createdAt: new Date().toISOString(),
        });
        return { success: true, url: result.data.url };
      }

      setError('Error al subir archivo');
      return { success: false, error: 'Error al subir archivo' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setArchivosSubiendo(Math.max(0, archivosSubiendo - 1));
    }
  };

  const vincularArchivo = async (id: string, payload: VincularArchivoPayload) => {
    try {
      await vincularMutation.mutateAsync({ id, payload });
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      return { success: false, error: errorMsg };
    }
  };

  const eliminarArchivo = async (id: string) => {
    try {
      await eliminarMutation.mutateAsync(id);
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      return { success: false, error: errorMsg };
    }
  };

  return {
    archivosSubiendo,
    progresoSubida,
    ultimoArchivoSubido,
    isUploading: uploadMutation.isPending,
    error,
    subirArchivo,
    vincularArchivo,
    eliminarArchivo,
    reset,
  };
};
