import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReporteDetalle } from '@/widgets/reporte-detalle';

export default function BrigadistaReporteDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return (
    <SafeAreaLayout variant="background">
      <View className="flex-row items-center px-2 pt-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 items-center justify-center rounded-full active:bg-slate-800/50"
          accessibilityLabel="Volver atrás"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Typography variant="h3" className="ml-2 text-white">
          Detalle del Reporte
        </Typography>
      </View>

      <ReporteDetalle reporteId={id} userRole="BRIGADISTA" />
    </SafeAreaLayout>
  );
}
