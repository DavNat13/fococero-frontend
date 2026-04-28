// src/shared/ui/atoms/Typography.tsx
import { ColorTheme, TypographyVariant } from '@shared/types';
import React from 'react';
import { Text, TextProps } from 'react-native';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: ColorTheme;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const Typography = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  className = '',
  children,
  ...props
}: TypographyProps) => {
  // Mapeo Estricto de Variantes
  const variantStyles: Record<TypographyVariant, string> = {
    display: 'text-4xl font-inter font-bold tracking-tighter',
    h1: 'text-2xl font-inter font-bold tracking-tight',
    h2: 'text-lg font-inter font-semibold',
    h3: 'text-base font-inter font-semibold',
    body: 'text-base font-inter font-normal',
    caption: 'text-xs font-inter font-medium tracking-wide uppercase',
    label: 'text-sm font-inter font-medium',
  };

  // Mapeo de Colores Semánticos (Basado en FocoCero Dark Mode)
  const colorStyles: Record<ColorTheme, string> = {
    primary: 'text-slate-100', // Blanco humo
    secondary: 'text-slate-400', // Gris ceniza
    tertiary: 'text-slate-500', // Gris oscuro
    brand: 'text-[#EA580C]', // Naranja FocoCero
    danger: 'text-red-500', // Alertas
    success: 'text-emerald-500', // Confirmaciones
    warning: 'text-amber-500', // Modo Invitado
    surface: 'text-slate-900', // Texto oscuro para fondos claros (si hay)
    background: 'text-slate-950',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  return (
    <Text
      className={`${variantStyles[variant]} ${colorStyles[color]} ${alignStyles[align]} ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
};
