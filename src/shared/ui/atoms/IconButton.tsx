// src/shared/ui/atoms/IconButton.tsx
import { SizeType } from '@shared/types';
import React from 'react';
import { ScalePress } from '../animations/ScalePress';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'solid' | 'ghost' | 'outline' | 'surface';
  size?: SizeType;
  disabled?: boolean;
  className?: string;
  isCircular?: boolean;
}

export const IconButton = ({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  isCircular = true,
}: IconButtonProps) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const variantMap = {
    solid: 'bg-[#EA580C] shadow-md shadow-[#EA580C]/20',
    ghost: 'bg-transparent active:bg-slate-800/50',
    outline: 'bg-transparent border border-slate-700',
    surface: 'bg-slate-800/80 border border-slate-700/50 backdrop-blur-md', // Ideal para flotar sobre el mapa
  };

  const shapeClass = isCircular ? 'rounded-full' : 'rounded-xl';

  return (
    <ScalePress
      onPress={disabled ? undefined : onPress}
      className={`items-center justify-center ${sizeMap[size]} ${variantMap[variant]} ${shapeClass} ${
        disabled ? 'opacity-50' : 'opacity-100'
      } ${className}`}
    >
      {icon}
    </ScalePress>
  );
};
