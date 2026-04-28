// src/features/auth/ui/components/LogoutButton.tsx

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useAuthActions } from '../../model/auth.selectors';

interface LogoutButtonProps {
  variant?: 'outline' | 'solid' | 'ghost';
  isLoading?: boolean;
}

export const LogoutButton = ({ variant = 'outline', isLoading = false }: LogoutButtonProps) => {
  const { logout } = useAuthActions();

  // Mapeo de estilos según la variante usando Tailwind (NativeWind)
  const styles = {
    outline: 'border border-red-200 bg-red-50 active:bg-red-100',
    solid: 'bg-red-600 active:bg-red-700',
    ghost: 'bg-transparent active:bg-red-50',
  };

  const textStyles = {
    outline: 'text-red-700 font-medium',
    solid: 'text-white font-bold',
    ghost: 'text-red-600 font-medium',
  };

  return (
    <TouchableOpacity
      onPress={logout}
      disabled={isLoading}
      className={`min-w-[120px] flex-row items-center justify-center rounded-lg px-4 py-2 ${styles[variant]}`}
      accessibilityLabel="Cerrar sesión de FocoCero"
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'solid' ? '#ffffff' : '#b91c1c'} size="small" />
      ) : (
        <Text className={`text-sm ${textStyles[variant]}`}>Cerrar Sesión</Text>
      )}
    </TouchableOpacity>
  );
};
