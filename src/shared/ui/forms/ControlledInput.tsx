// src/shared/ui/forms/ControlledInput.tsx
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input, InputProps } from '../atoms/Input';

interface ControlledInputProps<T extends FieldValues> extends Omit<
  InputProps,
  'value' | 'onChangeText'
> {
  control: Control<T>;
  name: Path<T>;
}

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  ...inputProps
}: ControlledInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <Input
          ref={ref}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...inputProps}
        />
      )}
    />
  );
};
