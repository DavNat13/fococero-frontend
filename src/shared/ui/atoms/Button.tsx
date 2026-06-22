// src/shared/ui/atoms/Button.tsx
import { ButtonVariant, SizeType } from '@shared/types';
import React from 'react';
import { View } from 'react-native';
import { ScalePress } from '../animations/ScalePress';
import { Spinner } from './Spinner';
import { Typography } from './Typography';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: SizeType;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button = ({
  label,
  onPress,
  variant = 'solid',
  size = 'lg',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
}: ButtonProps) => {
  const isActuallyDisabled = disabled || isLoading;

  // Mapa de alturas FSD
  const sizeStyles = {
    xs: 'h-8 px-3 rounded-md',
    sm: 'h-10 px-4 rounded-lg',
    md: 'h-12 px-5 rounded-xl',
    lg: 'h-14 px-6 rounded-2xl',
    xl: 'h-16 px-8 rounded-2xl',
    '2xl': 'h-16 px-8 rounded-2xl', // Fallback
  };

  // Mapa de Estilos Tácticos
  const variantStyles: Record<ButtonVariant, string> = {
    solid: 'bg-[#EA580C] shadow-lg shadow-[#EA580C]/30', // Naranja FocoCero
    outline: 'bg-transparent border-2 border-slate-700',
    ghost: 'bg-transparent',
    warning: 'bg-amber-500/10 border-2 border-amber-500/50',
    danger: 'bg-red-500/10 border-2 border-red-500/50',
  };

  // Colores del Texto y Spinner
  const contentColors = {
    solid: { text: 'primary', spinner: 'primary' },
    outline: { text: 'primary', spinner: 'brand' },
    ghost: { text: 'secondary', spinner: 'secondary' },
    warning: { text: 'warning', spinner: 'warning' },
    danger: { text: 'danger', spinner: 'danger' },
  } as const;

  const currentColors = contentColors[variant];

  return (
    <ScalePress
      onPress={isActuallyDisabled ? undefined : onPress}
      scaleTo={0.97}
      className={`w-full flex-row items-center justify-center ${sizeStyles[size]} ${variantStyles[variant]} ${
        isActuallyDisabled ? 'opacity-50' : 'opacity-100'
      } ${className}`}
    >
      {isLoading ? (
        <Spinner size={20} colorTheme={currentColors.spinner as any} />
      ) : (
        <View className="flex-row items-center justify-center gap-3">
          {leftIcon}
          <View className="flex-shrink">
            <Typography
              variant={size === 'sm' || size === 'xs' ? 'label' : 'h3'}
              color={currentColors.text as any}
              numberOfLines={1}
            >
              {label}
            </Typography>
          </View>
          {rightIcon}
        </View>
      )}
    </ScalePress>
  );
};
