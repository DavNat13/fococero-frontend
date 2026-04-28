// src/shared/ui/icons/StatusIcon.tsx
import { ColorTheme } from '@shared/types';
import React from 'react';
import { View } from 'react-native';
import { Icon, IconProps } from './Icon';

interface StatusIconProps extends IconProps {
  hasBadge?: boolean;
  badgeColor?: ColorTheme;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const StatusIcon = ({
  hasBadge = false,
  badgeColor = 'danger',
  badgePosition = 'top-right',
  ...iconProps
}: StatusIconProps) => {
  const colors: Record<ColorTheme, string> = {
    brand: 'bg-[#EA580C]',
    primary: 'bg-slate-100',
    secondary: 'bg-slate-400',
    tertiary: 'bg-slate-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    surface: 'bg-slate-800',
    background: 'bg-slate-950',
  };

  const positionStyles = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
  };

  return (
    <View className="relative">
      <Icon {...iconProps} />
      {hasBadge && (
        <View
          className={`absolute h-3 w-3 rounded-full border-2 border-surface-background ${colors[badgeColor]} ${positionStyles[badgePosition]}`}
        />
      )}
    </View>
  );
};
