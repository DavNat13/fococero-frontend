import React from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEvidenciaUploader } from '../hooks/useEvidenciaUploader';

interface EvidenciaUploaderProps {
  idMultimedia: string | undefined;
  onChange: (id: string | undefined) => void;
}

function UploadingState() {
  return (
    <View className="h-40 items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30">
      <ActivityIndicator size="large" color="#EA580C" />
      <Typography variant="caption" color="secondary" className="mt-3">
        Subiendo evidencia...
      </Typography>
    </View>
  );
}

function PreviewState({
  previewUri,
  onSelectImage,
  onTakePhoto,
  onRemove,
}: {
  previewUri: string;
  onSelectImage: () => void;
  onTakePhoto: () => void;
  onRemove: () => void;
}) {
  return (
    <View className="w-full overflow-hidden rounded-2xl">
      <Image source={{ uri: previewUri }} className="h-48 w-full" resizeMode="cover" />
      <View className="absolute inset-0 flex-row items-end justify-center pb-4">
        <TouchableOpacity
          onPress={onSelectImage}
          className="mr-3 rounded-full bg-slate-900/80 p-3"
          activeOpacity={0.7}
          accessibilityLabel="Cambiar imagen de galería"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="camera" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onTakePhoto}
          className="mr-3 rounded-full bg-slate-900/80 p-3"
          activeOpacity={0.7}
          accessibilityLabel="Tomar nueva foto"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="camera-enhance" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onRemove}
          className="rounded-full bg-red-500/80 p-3"
          activeOpacity={0.7}
          accessibilityLabel="Eliminar evidencia"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="delete" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DefaultState({
  onSelectImage,
  onTakePhoto,
}: {
  onSelectImage: () => void;
  onTakePhoto: () => void;
}) {
  return (
    <View className="w-full">
      <Typography variant="caption" color="secondary" className="mb-3 ml-1 uppercase">
        Evidencia (opcional)
      </Typography>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onSelectImage}
          className="flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 py-8"
          activeOpacity={0.7}
          accessibilityLabel="Seleccionar imagen de la galería"
          accessibilityRole="button"
        >
          <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-slate-700/50">
            <MaterialCommunityIcons name="image" size={22} color="#94A3B8" />
          </View>
          <Typography variant="body" color="tertiary">
            Galería
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onTakePhoto}
          className="flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 py-8"
          activeOpacity={0.7}
          accessibilityLabel="Tomar foto con la cámara"
          accessibilityRole="button"
        >
          <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-slate-700/50">
            <MaterialCommunityIcons name="camera" size={22} color="#94A3B8" />
          </View>
          <Typography variant="body" color="tertiary">
            Cámara
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function EvidenciaUploader({ idMultimedia, onChange }: EvidenciaUploaderProps) {
  const {
    isUploading,
    previewUri,
    uploadError,
    handleSelectImage,
    handleTakePhoto,
    handleRemove,
    setUploadError,
  } = useEvidenciaUploader({ onChange });

  if (isUploading) return <UploadingState />;

  if (idMultimedia && previewUri) {
    return (
      <PreviewState
        previewUri={previewUri}
        onSelectImage={handleSelectImage}
        onTakePhoto={handleTakePhoto}
        onRemove={handleRemove}
      />
    );
  }

  return (
    <View>
      <DefaultState onSelectImage={handleSelectImage} onTakePhoto={handleTakePhoto} />
      {uploadError && (
        <View className="mx-0 mt-3 flex-row items-center rounded-xl bg-red-500/10 px-4 py-3">
          <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" />
          <Typography variant="caption" color="danger" className="ml-2 flex-1">
            {uploadError}
          </Typography>
          <TouchableOpacity onPress={() => setUploadError(null)}>
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
