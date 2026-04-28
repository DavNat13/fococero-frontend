// src/shared/ui/forms/ControlledRadioGroup.tsx
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { View } from 'react-native';
import { ScalePress } from '../animations/ScalePress';
import { Typography } from '../atoms/Typography';

interface RadioOption {
  label: string;
  value: string | number;
  description?: string;
}

interface ControlledRadioGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: RadioOption[];
  label?: string;
  className?: string;
}

export const ControlledRadioGroup = <T extends FieldValues>({
  control,
  name,
  options,
  label,
  className = '',
}: ControlledRadioGroupProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className={`w-full ${className}`}>
          {label && (
            <Typography variant="caption" color="secondary" className="mb-3 ml-1 uppercase">
              {label}
            </Typography>
          )}

          <View className="gap-3">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <ScalePress
                  key={option.value.toString()}
                  onPress={() => onChange(option.value)}
                  scaleTo={0.98}
                  className={`flex-row items-center rounded-2xl border p-4 transition-colors ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-surface-elevated bg-surface-card'
                  }`}
                >
                  <View
                    className={`mr-4 h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isSelected ? 'border-brand-primary' : 'border-content-tertiary'
                    }`}
                  >
                    {isSelected && <View className="h-3 w-3 rounded-full bg-brand-primary" />}
                  </View>

                  <View className="flex-1">
                    <Typography variant="h3" color={isSelected ? 'primary' : 'secondary'}>
                      {option.label}
                    </Typography>
                    {option.description && (
                      <Typography variant="caption" color="tertiary" className="mt-0.5">
                        {option.description}
                      </Typography>
                    )}
                  </View>
                </ScalePress>
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
