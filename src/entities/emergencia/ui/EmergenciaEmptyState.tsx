import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/shared/ui/atoms/Typography';

export const EmergenciaEmptyState = () => {
  return (
    <View style={styles.emptyState}>
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

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
});
