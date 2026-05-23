// src/shared/ui/atoms/Badge.tsx
import { ColorTheme } from '@shared/types';
import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';

interface BadgeProps {
  label: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge = ({ label, status = 'info', className = '' }: BadgeProps) => {
  const statusStyles = {
    success: 'bg-emerald-500/10 border-emerald-500/30',
    warning: 'bg-amber-500/10 border-amber-500/30',
    danger: 'bg-red-500/10 border-red-500/30',
    info: 'bg-slate-500/10 border-slate-500/30',
  };

  const textColors: Record<string, ColorTheme> = {
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'secondary',
  };

  return (
    <View
      className={`self-start rounded-full border px-3 py-1 ${statusStyles[status]} ${className}`}
    >
      <Typography variant="caption" color={textColors[status]} className="font-bold">
        {label}
      </Typography>
    </View>
  );
};
