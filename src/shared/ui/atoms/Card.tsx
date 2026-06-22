// src/shared/ui/atoms/Card.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', style, ...props }: CardProps) => {
  return (
    <View className={`rounded-2xl bg-slate-800 p-4 ${className}`} style={style} {...props}>
      {children}
    </View>
  );
};
