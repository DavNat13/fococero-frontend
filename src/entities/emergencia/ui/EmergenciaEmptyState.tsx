import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/shared/ui/atoms/Typography';

export const EmergenciaEmptyState = () => {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <MaterialCommunityIcons name="shield-check-outline" size={64} color="#4B5563" />
      <Typography variant="body" className="mt-4 text-gray-400">
        No hay emergencias activas
      </Typography>
      <Typography variant="caption" className="mt-2 text-gray-500">
        Todas las situaciones están bajo control
      </Typography>
    </View>
  );
};
