// src/shared/ui/atoms/Avatar.tsx
import { SizeType } from '@shared/types';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { Typography } from './Typography';

interface AvatarProps {
  src?: string | null;
  fallbackInitials: string;
  size?: SizeType;
  isOnline?: boolean;
  className?: string;
}

export const Avatar = ({
  src,
  fallbackInitials,
  size = 'md',
  isOnline,
  className = '',
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
  };

  const textVariantMap = {
    xs: 'caption',
    sm: 'label',
    md: 'h3',
    lg: 'h2',
    xl: 'h1',
    '2xl': 'display',
  } as const;

  const showImage = src && !imageError;

  return (
    <View className={`${sizeMap[size]} relative rounded-full ${className}`}>
      <View
        className={`h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-slate-700 bg-slate-800`}
      >
        {showImage ? (
          <Image
            source={{ uri: src }}
            className="h-full w-full"
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <Typography variant={textVariantMap[size]} color="primary" className="font-bold">
            {fallbackInitials.toUpperCase().slice(0, 2)}
          </Typography>
        )}
      </View>

      {/* Indicador de estado opcional */}
      {isOnline !== undefined && (
        <View
          className={`absolute bottom-0 right-0 h-1/4 w-1/4 rounded-full border-2 border-surface-background ${isOnline ? 'bg-emerald-500' : 'bg-slate-500'}`}
        />
      )}
    </View>
  );
};
