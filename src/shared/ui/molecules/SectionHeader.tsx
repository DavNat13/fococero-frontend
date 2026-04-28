// src/shared/ui/molecules/SectionHeader.tsx
import { Icon, Icons, Typography } from '@shared/ui';
import React from 'react';
import { Pressable, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const SectionHeader = ({
  title,
  actionLabel,
  onAction,
  className = '',
}: SectionHeaderProps) => (
  <View className={`mb-4 w-full flex-row items-end justify-between ${className}`}>
    <Typography variant="h2" className="font-bold">
      {title}
    </Typography>
    {actionLabel && (
      <Pressable onPress={onAction} className="flex-row items-center">
        <Typography variant="label" color="brand" className="mr-1">
          {actionLabel}
        </Typography>
        <Icon icon={Icons.ChevronRight} size={14} colorTheme="brand" />
      </Pressable>
    )}
  </View>
);
