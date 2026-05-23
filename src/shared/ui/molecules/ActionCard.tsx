// src/shared/ui/molecules/ActionCard.tsx
import { Icon, Icons } from '../icons';
import { ScalePress } from '../animations/ScalePress';
import { Typography } from '../atoms/Typography';
import React from 'react';
import { View } from 'react-native';

interface ActionCardProps {
  title: string;
  description: string;
  icon: any;
  onPress: () => void;
  className?: string;
}

export const ActionCard = ({
  title,
  description,
  icon,
  onPress,
  className = '',
}: ActionCardProps) => (
  <ScalePress
    onPress={onPress}
    className={`w-full flex-row items-center rounded-3xl border border-surface-elevated bg-surface-card p-5 ${className}`}
  >
    <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10">
      <Icon icon={icon} size="lg" colorTheme="brand" />
    </View>
    <View className="flex-1">
      <Typography variant="h2">{title}</Typography>
      <Typography variant="body" color="secondary">
        {description}
      </Typography>
    </View>
    <Icon icon={Icons.Plus} size="sm" colorTheme="tertiary" />
  </ScalePress>
);
