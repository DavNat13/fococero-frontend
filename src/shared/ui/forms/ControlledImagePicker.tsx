// src/shared/ui/forms/ControlledImagePicker.tsx
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Image, Pressable, View } from 'react-native';
import { Typography } from '../atoms/Typography';
import { Icon, Icons } from '../icons';

interface ControlledImagePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  onImageSelect: (onChange: (...event: any[]) => void) => Promise<void>;
  // Le delegamos la lógica de Expo Image Picker al Feature que lo llame
  className?: string;
}

export const ControlledImagePicker = <T extends FieldValues>({
  control,
  name,
  label,
  onImageSelect,
  className = '',
}: ControlledImagePickerProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className={`w-full ${className}`}>
          {label && (
            <Typography variant="caption" color="secondary" className="mb-2 ml-1 uppercase">
              {label}
            </Typography>
          )}

          <Pressable
            onPress={() => onImageSelect(onChange)}
            className={`h-40 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
              error
                ? 'border-feedback-danger bg-feedback-danger/5'
                : value
                  ? 'border-brand-primary'
                  : 'border-surface-elevated bg-surface-background'
            }`}
          >
            {value ? (
              <>
                <Image source={{ uri: value }} className="h-full w-full" resizeMode="cover" />
                <View className="absolute inset-0 items-center justify-center bg-black/40 opacity-0 active:opacity-100">
                  <Icon icon={Icons.Camera} size="lg" colorTheme="primary" />
                  <Typography variant="caption" className="mt-2 text-white">
                    Cambiar Evidencia
                  </Typography>
                </View>
              </>
            ) : (
              <View className="items-center justify-center">
                <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-surface-card">
                  <Icon icon={Icons.Camera} size="md" colorTheme="brand" />
                </View>
                <Typography variant="body" color="primary">
                  Adjuntar Evidencia
                </Typography>
                <Typography variant="caption" color="secondary" className="mt-1">
                  Toca para abrir la cámara o galería
                </Typography>
              </View>
            )}
          </Pressable>

          {error && (
            <Typography variant="caption" color="danger" className="ml-1 mt-2">
              {error.message}
            </Typography>
          )}
        </View>
      )}
    />
  );
};
