// src/shared/ui/forms/ControlledCheckbox.tsx
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { View } from 'react-native';
import { Checkbox } from '../atoms/Checkbox';
import { Typography } from '../atoms/Typography';

interface ControlledCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
}

export const ControlledCheckbox = <T extends FieldValues>({
  control,
  name,
  label,
  className = '',
}: ControlledCheckboxProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className={className}>
          <Checkbox checked={value} onChange={onChange} label={label} />
          {error && (
            <Typography variant="caption" color="danger" className="ml-9 mt-1">
              {error.message}
            </Typography>
          )}
        </View>
      )}
    />
  );
};
