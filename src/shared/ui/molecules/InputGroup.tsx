// src/shared/ui/molecules/InputGroup.tsx
import React from 'react';
import { View } from 'react-native';
import { Input } from '@shared/ui/atoms/Input';
import type { InputProps } from '@shared/ui/atoms/Input';

export const InputGroup = (props: InputProps) => (
  <View className="mb-5 w-full">
    <Input {...props} />
  </View>
);
