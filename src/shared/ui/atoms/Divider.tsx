// src/shared/ui/atoms/Divider.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';

interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider = ({ label, className = '' }: DividerProps) => {
  return (
    <View className={`my-4 w-full flex-row items-center opacity-60 ${className}`}>
      <View className="h-[1px] flex-1 bg-slate-700" />
      {label && (
        <Typography variant="caption" color="secondary" className="px-4">
          {label}
        </Typography>
      )}
      <View className="h-[1px] flex-1 bg-slate-700" />
    </View>
  );
};
