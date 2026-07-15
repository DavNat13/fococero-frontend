import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';

export function OfflineBanner() {
  const { isConnected } = useNetworkStatus();

  if (isConnected) return null;

  return (
    <View className="mx-4 mb-4 flex-row items-center rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
      <MaterialCommunityIcons name="wifi-off" size={18} color="#F59E0B" />
      <Typography variant="caption" className="ml-2 flex-1 text-amber-400">
        Sin conexión a internet. Los cambios se sincronizarán cuando haya conexión.
      </Typography>
    </View>
  );
}
