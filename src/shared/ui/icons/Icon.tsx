// src/shared/ui/icons/Icon.tsx
import { ColorTheme, SizeType } from '@shared/types';
import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export interface IconProps {
  icon: LucideIcon;
  size?: SizeType | number;
  colorTheme?: ColorTheme;
  colorHex?: string;
  strokeWidth?: number;
  className?: string;
  testID?: string;
}

export const Icon = ({
  icon: LucideComponent,
  size = 'md',
  colorTheme = 'primary',
  colorHex,
  strokeWidth = 2,
  className = '',
  testID,
}: IconProps) => {
  const sizeMap: Record<SizeType, number> = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
  };

  const finalSize = typeof size === 'number' ? size : sizeMap[size];

  const colors: Record<ColorTheme, string> = {
    brand: '#EA580C',
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    tertiary: '#475569',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    surface: '#0F172A',
    background: '#020617',
  };

  const finalColor = colorHex || colors[colorTheme];

  return (
    <View className={`items-center justify-center ${className}`} testID={testID}>
      <LucideComponent size={finalSize} color={finalColor} strokeWidth={strokeWidth} />
    </View>
  );
};
