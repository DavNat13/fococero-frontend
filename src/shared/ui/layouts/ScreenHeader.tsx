// src/shared/ui/layouts/ScreenHeader.tsx
import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Typography, IconButton } from '@shared/ui/atoms';
import { Icons, Icon } from '@shared/ui/icons';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode; // Para poner un botón de "Guardar" o "Filtros"
  transparent?: boolean;
  className?: string;
}

export const ScreenHeader = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  rightAction,
  transparent = false,
  className = '',
}: ScreenHeaderProps) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const bgClass = transparent
    ? 'bg-transparent'
    : 'bg-surface-background border-b border-surface-elevated';

  return (
    <View
      className={`h-16 w-full flex-row items-center justify-between px-2 ${bgClass} z-50 ${className}`}
    >
      {/* Zona Izquierda (Botón Atrás) */}
      <View className="w-12 items-start justify-center">
        {showBackButton && (
          <IconButton
            icon={<Icon icon={Icons.ChevronLeft} size="lg" colorTheme="primary" />}
            onPress={handleBack}
          />
        )}
      </View>

      {/* Zona Central (Títulos) */}
      <View className="flex-1 items-center justify-center">
        {title && (
          <Typography variant="h2" color="primary" numberOfLines={1} className="text-center">
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="caption"
            color="secondary"
            numberOfLines={1}
            className="mt-0.5 text-center"
          >
            {subtitle}
          </Typography>
        )}
      </View>

      {/* Zona Derecha (Acciones extra) */}
      <View className="w-12 items-end justify-center">{rightAction}</View>
    </View>
  );
};
