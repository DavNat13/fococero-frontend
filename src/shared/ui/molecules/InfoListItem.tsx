// src/shared/ui/molecules/InfoListItem.tsx
import { Icon, Icons, ScalePress, Typography } from '@shared/ui';
import React from 'react';
import { View } from 'react-native';

interface InfoListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: any;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}

export const InfoListItem = ({
  title,
  subtitle,
  leftIcon,
  rightElement,
  onPress,
  isLast,
}: InfoListItemProps) => (
  <ScalePress
    onPress={onPress}
    className={`flex-row items-center py-4 ${!isLast ? 'border-b border-surface-elevated' : ''}`}
  >
    {leftIcon && (
      <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-surface-background">
        <Icon icon={leftIcon} size="sm" colorTheme="brand" />
      </View>
    )}
    <View className="flex-1">
      <Typography variant="h3">{title}</Typography>
      {subtitle && (
        <Typography variant="caption" color="secondary">
          {subtitle}
        </Typography>
      )}
    </View>
    {rightElement || <Icon icon={Icons.ChevronRight} size="sm" colorTheme="tertiary" />}
  </ScalePress>
);
