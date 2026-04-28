// src/shared/ui/molecules/EmptyState.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography, Button, FadeIn } from '@shared/ui';

interface EmptyStateProps {
  illustration: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  illustration,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <FadeIn className="flex-1 items-center justify-center p-8">
    <View className="mb-6 opacity-80">{illustration}</View>
    <Typography variant="h2" align="center" className="mb-2">
      {title}
    </Typography>
    <Typography variant="body" color="secondary" align="center" className="mb-8">
      {description}
    </Typography>
    {actionLabel && (
      <Button
        label={actionLabel}
        variant="outline"
        onPress={onAction || (() => {})}
        className="w-auto px-10"
      />
    )}
  </FadeIn>
);
