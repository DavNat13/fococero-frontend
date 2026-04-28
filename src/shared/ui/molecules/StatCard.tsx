// src/shared/ui/molecules/StatCard.tsx
import { ColorTheme } from '@shared/types';
import { Icon, Icons, ScalePress, Typography } from '@shared/ui';
import React from 'react';
import { View } from 'react-native';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: any;
  colorTheme?: ColorTheme;
  trend?: { value: string; isUp: boolean };
  onPress?: () => void;
}

export const StatCard = ({
  label,
  value,
  unit,
  icon,
  colorTheme = 'brand',
  trend,
  onPress,
}: StatCardProps) => (
  <ScalePress
    onPress={onPress}
    className="min-w-[140px] flex-1 rounded-2xl border border-surface-elevated bg-surface-card p-4"
  >
    <View className="mb-3 flex-row items-start justify-between">
      <View className={`rounded-lg bg-surface-background p-2`}>
        <Icon icon={icon} size="sm" colorTheme={colorTheme} />
      </View>
      {trend && (
        <View className="flex-row items-center">
          <Icon
            icon={trend.isUp ? Icons.ChevronUp : Icons.ChevronDown}
            size={14}
            colorTheme={trend.isUp ? 'danger' : 'success'}
          />
          <Typography
            variant="caption"
            color={trend.isUp ? 'danger' : 'success'}
            className="ml-0.5"
          >
            {trend.value}
          </Typography>
        </View>
      )}
    </View>
    <Typography variant="caption" color="secondary" className="uppercase tracking-widest">
      {label}
    </Typography>
    <View className="mt-1 flex-row items-baseline">
      <Typography variant="h1" color="primary">
        {value}
      </Typography>
      {unit && (
        <Typography variant="body" color="secondary" className="ml-1">
          {unit}
        </Typography>
      )}
    </View>
  </ScalePress>
);
