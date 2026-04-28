// src/shared/ui/forms/ControlledSwitch.tsx
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { View } from 'react-native';
import { Switch } from '../atoms/Switch';
import { Typography } from '../atoms/Typography';

interface ControlledSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  className?: string;
}

export const ControlledSwitch = <T extends FieldValues>({
  control,
  name,
  label,
  className = '',
}: ControlledSwitchProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className={`flex-row items-center justify-between py-2 ${className}`}>
          <Typography variant="body" color="primary">
            {label}
          </Typography>
          <Switch value={value} onValueChange={onChange} />
        </View>
      )}
    />
  );
};
