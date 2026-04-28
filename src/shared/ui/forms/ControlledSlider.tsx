// src/shared/ui/forms/ControlledSlider.tsx
import Slider from '@react-native-community/slider';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { View } from 'react-native';
import { Typography } from '../atoms/Typography';

interface ControlledSliderProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export const ControlledSlider = <T extends FieldValues>({
  control,
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  className = '',
}: ControlledSliderProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View
          className={`w-full rounded-2xl border border-surface-elevated bg-surface-card p-4 ${className}`}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <Typography variant="h3">{label}</Typography>
            <Typography variant="h2" color="brand">
              {value || min} {unit}
            </Typography>
          </View>

          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value || min}
            onValueChange={onChange}
            minimumTrackTintColor="#EA580C" // Naranja FocoCero
            maximumTrackTintColor="#475569" // Slate 600
            thumbTintColor="#EA580C"
          />

          <View className="mt-[-5px] flex-row justify-between px-2">
            <Typography variant="caption" color="tertiary">
              {min}
            </Typography>
            <Typography variant="caption" color="tertiary">
              {max}
            </Typography>
          </View>

          {error && (
            <Typography variant="caption" color="danger" className="mt-2">
              {error.message}
            </Typography>
          )}
        </View>
      )}
    />
  );
};
