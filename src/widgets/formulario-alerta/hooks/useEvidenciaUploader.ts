import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { multimediaApi } from '@/entities/multimedia';

interface UseEvidenciaUploaderOptions {
  onChange: (id: string | undefined) => void;
}

export function useEvidenciaUploader({ onChange }: UseEvidenciaUploaderOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (uri: string, mimeType: string | null, fileName: string | null) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('archivo', {
        uri,
        type: mimeType || 'image/jpeg',
        name: fileName || 'evidencia.jpg',
      } as unknown as Blob);
      formData.append('contexto', 'reporte');

      const response = await multimediaApi.subirArchivo(formData);
      if (!response.success) throw new Error(response.error.message);

      onChange(response.data.id);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al subir imagen';
      if (
        message.includes('interno') ||
        message.includes('Firebase') ||
        message.includes('credenciales')
      ) {
        setUploadError(
          'Error al subir imagen. Verifica la conexión con el servidor e intenta de nuevo.',
        );
      } else {
        setUploadError(message);
      }
      setPreviewUri(null);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectImage = async () => {
    setUploadError(null);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setUploadError('Se requiere permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      setPreviewUri(asset.uri);
      await uploadImage(asset.uri, asset.mimeType ?? null, asset.fileName ?? null);
    } catch {
      setUploadError('Error al seleccionar imagen');
    }
  };

  const handleTakePhoto = async () => {
    setUploadError(null);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setUploadError('Se requiere permiso para usar la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      setPreviewUri(asset.uri);
      await uploadImage(asset.uri, asset.mimeType ?? null, asset.fileName ?? null);
    } catch {
      setUploadError('Error al tomar foto');
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setPreviewUri(null);
    setUploadError(null);
  };

  return {
    isUploading,
    previewUri,
    uploadError,
    handleSelectImage,
    handleTakePhoto,
    handleRemove,
    setUploadError,
  };
}
