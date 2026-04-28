// src/shared/ui/forms/ControlledSegmentedControl.tsx
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { Typography } from '../atoms/Typography';

interface Option {
  label: string;
  value: string | number;
}

interface ControlledSegmentedControlProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: Option[];
  label?: string;
  className?: string;
}

export const ControlledSegmentedControl = <T extends FieldValues>({
  control,
  name,
  options,
  label,
  className = '',
}: ControlledSegmentedControlProps<T>) => {
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

          <View className="h-14 w-full flex-row rounded-2xl border border-surface-elevated bg-surface-background p-1">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <Pressable
                  key={option.value.toString()}
                  onPress={() => onChange(option.value)}
                  className={`flex-1 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? 'border border-surface-elevated bg-surface-card shadow-sm shadow-black/50'
                      : 'bg-transparent'
                  }`}
                >
                  <Typography
                    variant="label"
                    color={isSelected ? 'brand' : 'secondary'}
                    className={isSelected ? 'font-bold' : ''}
                  >
                    {option.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>

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
