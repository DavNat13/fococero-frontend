// app/(brigadista)/index.tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import { Typography } from '@shared/ui/atoms/Typography';

export default function BrigadistaDashboard() {
  useEffect(() => {
    // Temporal: redirigir a la página principal si no hay routes dentro de brigadista
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-surface-background">
      <Typography variant="h1">Dashboard Brigadista</Typography>
    </View>
  );
}
