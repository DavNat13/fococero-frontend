// src/shared/ui/molecules/InputGroup.tsx
import React from 'react';
import { View } from 'react-native';
import { Input, InputProps } from '@shared/ui';

export const InputGroup = (props: InputProps) => (
  <View className="mb-5 w-full">
    <Input {...props} />
  </View>
);
