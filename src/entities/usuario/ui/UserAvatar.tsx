// src/entities/usuario/ui/UserAvatar.tsx

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Usuario } from '../model/usuario.types';

interface UserAvatarProps {
  user: Usuario | null;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ user, size = 'md' }: UserAvatarProps) => {
  const containerSize = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  }[size];

  const textSize = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-2xl',
  }[size];

  // Obtenemos iniciales para el fallback
  const initials =
    `${user?.nombre?.charAt(0) || ''}${user?.apellido?.charAt(0) || ''}`.toUpperCase();

  return (
    <View
      className={`${containerSize} items-center justify-center overflow-hidden rounded-full border-2 border-orange-200 bg-orange-100`}
    >
      {/* Si tuviéramos URL de imagen en el modelo, usaríamos <Image /> aquí */}
      <Text className={`font-bold text-orange-700 ${textSize}`}>{initials || '?'}</Text>
    </View>
  );
};
